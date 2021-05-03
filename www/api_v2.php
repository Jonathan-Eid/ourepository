<?php
session_start();

if(!isset($_SESSION["count"])){
    $_SESSION["count"] = 0;
}else{
    $_SESSION["count"] = $_SESSION["count"]+1;
}

use \Firebase\JWT\JWT;


$secret_key = "test_secret";

header("Access-Control-Allow-Origin: "."http://".getenv("REACT_DOMAIN").":".getenv("REACT_PORT"));
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 1000");
header("Access-Control-Allow-Headers: alg, X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding,xhrfields,crossdomain");
header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS, DELETE");

require_once "bootstrap.php";
require_once "upload_2.php";
require_once "mosaics_v2.php";
require_once "export_labels_v2.php";
require_once "predictions.php";
require_once "permissions.php";

global $entityManager;

foreach ($_FILES as $file) {
    error_log("file: " . json_encode($file));
}

foreach ($_GET as $key => $value) {
    error_log("_GET['$key']: '$value'");
}

foreach ($_POST as $key => $value) {
    error_log("_POST['$key']: '$value'");
}

// Get $id_token via HTTPS POST.
if (isset($_POST['request'])) {
    $request_type = $_POST['request'];

} else if(isset($_GET['request'])){

    $request_type = $_GET['request'];

}else{

    return;
}

if($request_type == "CREATE_USER"){
    //TODO: Check if User is already created

    $email = $_POST['email'];
    $username = $_POST['username'];
    $given_name = $_POST['givenName'];
    $family_name = $_POST['familyName'];


    $existingUser=$entityManager->getRepository('User')
                                ->findOneBy(array('email' => $email));



    if (isset($existingUser)){
        error_log(json_encode($existingUser->getEmail()));
        error_log("USER EXISTS");
        echo rsp_msg("user_exists","A user with this email already exists");
        return;
    }

    $newUser = new User();

    $password = $_POST['password'];
    $shake = $_POST['shake'];

    $newUser->setEmail($email);
    $newUser->setShake($shake);

    $newUser->setGivenName($given_name);
    $newUser->setFamilyName($family_name);

    $newUser->setEmail($email);
    $newUser->setShake($shake);
    $newUser->setDescription("");

    $hash = hash_pbkdf2("sha256", $password, $shake, 16, 20);

    $newUser->setHash($hash);
    $newUser->setAdmin(false);
    $entityManager->persist($newUser);

    try{
        $entityManager->flush();

        $existingUser=$entityManager->getRepository('User')
        ->findOneBy(array('email' => $email));
        error_log("USER EXISTS");

        $_SESSION["uid"]= $existingUser->getId();
        $_SESSION["id"]= session_id();
        echo rsp_msg("created_user",$_SESSION["id"]);

    }
    catch (Exception $e) {
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }

} else if($request_type == "LOGIN_USER"){
    $email = $_POST['email'];
    error_log(json_encode("email: " . $_POST['email']));

    $existingUser=$entityManager->getRepository('User')
                                ->findOneBy(array('email' => $email));

    $password = $_POST['password'];

    if (isset($existingUser)){
        error_log(json_encode("SESSION COUNT: " . $_SESSION["count"]));
        $shake = $existingUser->getShake();

        $checkHash = hash_pbkdf2("sha256", $password, $shake, 16, 20);

        if($checkHash == $existingUser->getHash()){
            error_log("USER EXISTS");
            $_SESSION["uid"]= $existingUser->getId();
            $_SESSION["id"]=session_id();
            echo rsp_msg("hash_matches",$_SESSION["id"]);
            return;
        }

    }else{

        echo json_encode(session_id());
        return;

    }
    
} else if($request_type == "GET_AUTH"){

    error_log(session_id()."SESSION".$_SESSION["id"]);

    if($_SESSION["id"] == session_id()){
        echo json_encode("true");
    }else{
        echo json_encode("false");

    }

}else if($request_type == "LOGOUT_USER"){

    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
    }
    session_unset();
    session_destroy();
    echo json_encode("true");


}else if($request_type == "CREATE_ORG"){

    global $org_perm_map;

    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $existingUser=$entityManager->getRepository('User')
    ->findOneBy(array('id' => $_SESSION['uid']));

    $visible = $_POST['visible'];
    $org_name = $_POST['name'];

    $adminRole = new Role();
    $adminRole->setName("admin");
    $entityManager->persist($adminRole);

    $defaultRole= new Role();
    $defaultRole->setName("default");
    $entityManager->persist($defaultRole);

    $newMemberRole = new MemberRole();
    $newMemberRole->setMember($existingUser);
    $newMemberRole->setRole($adminRole);
    $entityManager->persist($newMemberRole);

    $newOrgACL = new OrgACL();
    $newOrgACL->setPermission($org_perm_map->{'ALL'});
    $newOrgACL->setRole($adminRole);
    $entityManager->persist($newOrgACL);

    $defaultACL = new OrgACL();
    $defaultACL->setPermission($org_perm_map->{'VIEW_PROJECTS'});
    $defaultACL->setRole($defaultRole);
    $entityManager->persist($defaultACL);

    $newOrganization = new Organization();
    $newOrganization->addMemberRole($newMemberRole);
    $newOrganization->addOrgACL($newOrgACL);
    $newOrganization->addRole($adminRole);
    $newOrganization->addRole($defaultRole);
    $newOrganization->setName($org_name);
    $newOrganization->setVisible($visible);

    $newMemberRole->setOrganization($newOrganization);
    $adminRole->setOrganization($newOrganization);
    $defaultRole->setOrganization($newOrganization);
    $newOrgACL->setOrganization($newOrganization);
    $defaultACL->setOrganization($newOrganization);

    $entityManager->persist($newOrganization);

    try{
        $entityManager->flush();

        echo rsp_msg("ORG_CREATED","org_created");

    }
    catch (Exception $e) {
        echo json_encode("error in org creation");
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }

} else if ($request_type == "GET_SIDEBAR_ORGS") {
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];

    try {
        $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WHERE m.member = '.$uid);
        $orgs = $query->getResult();
        if(count($orgs) == 0){
            echo rsp_msg("SIDEBAR_ORGS_FAILED","no orgs were returned in the query");
            return;
        }

        $response = array();

        // get organizations that contain projects that contain mosaics
        $response["organizations"] = array();
        $i = 0;
        foreach ($orgs as $organizationUuid) {
            array_push($response["organizations"], $organizationUuid->jsonSerialize());
            $projects = $organizationUuid->getProjects();

            $response["organizations"][$i]["projects"] = array();
            foreach ($projects as $project) {
                array_push($response["organizations"][$i]["projects"], $project->jsonSerialize());
            }
            $i++;
        }

        echo rsp_msg("SIDEBAR_ORGS_RECEIVED", $response);
    } catch (Exception $e){
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }
} else if ($request_type == "GET_ORGS") {
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];

    try {
        $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WHERE m.member = '.$uid);
        $orgs = $query->getResult();
        if(count($orgs) == 0){
            echo rsp_msg("ORGS_RECEIVED_FAILED","no orgs were returned in the query");
            return;
        }

        $response = array();

        // get organizations
        $response["organizations"] = array();
        foreach ($orgs as $organizationUuid) {
            array_push($response["organizations"], $organizationUuid->jsonSerialize());
        }

        echo rsp_msg("ORGS_RECEIVED", $response);
    } catch (Exception $e){
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }
}else if($request_type == "GET_AUTH_ORG_BY_UUID"){
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];
    $oid = $_GET['uuid'];

    try{

        $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WHERE m.member = '.$uid.' AND  o.uuid = \''.$oid.'\'');
        $orgs = $query->getResult();
       if(!isset($orgs)){
        echo rsp_msg("ORGS_RECEIVED_FAILED","no orgs were returned in the query");
        return;
    }
        echo rsp_msg("ORGS_RECEIVED",$orgs[0]);
    }

    catch (Exception $e){
        echo 'Caught exception: ',  $e->getMessage(), "\n";

    }

}else if($request_type == "HAS_ORG_PERMISSION"){
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];
    $permission = $_GET['permission'];
    $organization = $_GET['organization'];

    //echo rsp_msg("ORGS_RECEIVED",$orgs);    
    try{

        $query = $entityManager->createQuery('SELECT o FROM OrgACL o JOIN o.organization g WITH g.uuid = :org JOIN g.memberRoles m WITH m.member = :uid AND m.role = o.role WHERE o.permission IN (:permissions)');
        $query->setParameter('org', $organization);
        $query->setParameter('uid', $uid);
        $query->setParameter('permissions', array('all',$permission));


        $acls = $query->getResult();
        if(!isset($acls)){
            echo rsp_msg("NO_ORG_PERMISSION","The user does not have the proper permissions");
            return;
        }
        echo rsp_msg("HAS_ORG_PERMISSION",$acls);
    }
    

    catch (Exception $e){
        echo 'Caught exception: ',  $e->getMessage(), "\n";

    }

    return;

}else if($request_type == "GET_ORG_ROLES"){
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];
    $organization = $_GET['organization'];


    try{

        $query = $entityManager->createQuery('SELECT r FROM Role r JOIN r.organization g WITH g.uuid = :org JOIN g.memberRoles m WITH m.member = :uid');
        $query->setParameter('org', $organization);
        $query->setParameter('uid', $uid);


        $roles = $query->getResult();
        if(!isset($roles)){
            echo rsp_msg("NO_ORG_ROLE","Failed to retrieves roles from organization");
            return;
        }
        echo rsp_msg("ORG_ROLES_RECEIVED",$roles);
    }
    catch (Exception $e){
        echo 'Caught exception: ',  $e->getMessage(), "\n";

    }

    return;
}else if($request_type == "GET_ORG_USERS"){
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];
    $organization = $_GET['organization'];


    try{

        $query = $entityManager->createQuery('SELECT m FROM MemberRole m JOIN m.organization g WITH g.uuid = :org JOIN m.member r');
        $query->setParameter('org', $organization);


        $users = $query->getResult();
        if(!isset($users)){
            echo rsp_msg("NO_ORG_USER","Failed to retrieves users from organization");
            return;
        }
        echo rsp_msg("ORG_USERS_RECEIVED",$users);
    }
    catch (Exception $e){
        echo 'Caught exception: ',  $e->getMessage(), "\n";

    }

    return;
}else if($request_type == "GET_ROLE_PERMISSIONS"){
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];
    $roleId = $_GET['roleId'];


    try{

        $query = $entityManager->createQuery('SELECT a FROM OrgACL a JOIN a.role r WITH r.id = :role_id');
        $query->setParameter('role_id', $roleId);


        $roles = $query->getResult();
        if(!isset($roles)){
            echo rsp_msg("NO_ROLE_PERMISSIONS","Failed to retrieve permissions for this role");
            return;
        }
        echo rsp_msg("ROLE_PERMISSIONS_RECEIVED",$roles);
    }
    catch (Exception $e){
        echo 'Caught exception: ',  $e->getMessage(), "\n";

    }

    return;
}else if($request_type == "CHANGE_ROLE_PERMISSIONS"){
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];
    $roleId = $_POST['roleId'];
    $changes = $_POST['changes'];

    //The change object contains keys and values that represent permissions 
    //and a boolean representing whether to add(true) or remove(false) a permission
    //Model -
    // {Permissions: boolean  }
    // Ex -
    // {all: true}
    // {add_members: false}

    $changeObj = json_decode($changes);

    if(!isset($changes)){
        return;
    }

    try{
        


        $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WHERE m.member = '.$uid.' AND  m.role = \''.$roleId.'\'');
        $organizationUuid = $query->getResult()[0];
        error_log(json_encode($organizationUuid));
        $role=$entityManager->getRepository('Role')
                            ->findOneBy(array('id' => $roleId));

        foreach($changeObj as $key => $value) {

            error_log($key . " => " . $value);

            if($value){

                $newOrgACL = new OrgACL();

                $newOrgACL->setOrganization($organizationUuid);

                $newOrgACL->setRole($role);

                $newOrgACL->setPermission($key);

                $entityManager->persist($newOrgACL);
                


            }else{

                $query = $entityManager->createQuery('SELECT a FROM OrgACL a JOIN a.role r WITH r.id = :role_id WHERE a.permission = :permission');
                $query->setParameter('permission', $key);
                $query->setParameter('role_id', $roleId);

                $res = $query->getResult()[0];

                $entityManager->remove($res);


            }
        
        }

        echo rsp_msg("ROLE_PERMISSIONS_CHANGED",$roles);


    }
    catch(Exception $e){
        error_log(json_encode($e));
    }

    $entityManager->flush();


    return;

}else if($request_type == "ADD_ROLE"){
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];
    $roleName = $_POST['roleName'];
    $changes = $_POST['changes'];
    $organization = $_POST['organization'];

    //The change object contains keys and values that represent permissions 
    //and a boolean representing whether to add(true) or remove(false) a permission
    //Model -
    // {Permissions: boolean  }
    // Ex -
    // {all: true}
    // {add_members: false}

    $changeObj = json_decode($changes);

    if(!isset($changes)){
        return;
    }

    try{
        


        $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WITH m.member = :uid WHERE o.uuid = :organization');
        $query->setParameter('organization', $organization);
        $query->setParameter('uid', $uid);
        
        $organizationUuid = $query->getResult()[0];
        error_log(json_encode($organizationUuid));
        $role= new Role();
        $role->setName($roleName);
        $role->setOrganization($organizationUuid);

        $entityManager->persist($role);

        foreach($changeObj as $key => $value) {

            error_log($key . " => " . $value);

            if($value){

                $newOrgACL = new OrgACL();

                $newOrgACL->setOrganization($organizationUuid);

                $newOrgACL->setRole($role);

                $newOrgACL->setPermission($key);

                $entityManager->persist($newOrgACL);
                
            }
        
        }

        echo rsp_msg("ROLE_ADDED",$roles);


    }
    catch(Exception $e){
        error_log(json_encode($e));
    }

    $entityManager->flush();

    return;
}else if($request_type == "DELETE_ROLE"){
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];
    $roleId = $_POST['roleId'];

    try{
        


        $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WHERE m.member = '.$uid.' AND  m.role = \''.$roleId.'\'');
        $organizationUuid = $query->getResult()[0];
        error_log(json_encode($organizationUuid));
        $role=$entityManager->getRepository('Role')
                            ->findOneBy(array('id' => $roleId));
        if(!isset($role)){
            return;
        }

        $entityManager->remove($role);

        echo rsp_msg("ROLE_DELETED",$role);


    }
    catch(Exception $e){
        error_log(json_encode($e));
    }

    $entityManager->flush();


    return;

}else if($request_type == "ADD_USER"){
    
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];
    $role = $_POST['role'];
    $email = $_POST['email'];
    



    $existingRole = $entityManager->getRepository('Role')
    ->findOneBy(array('id' => $role));

    $existingOrg = $existingRole->getOrganization();

    $existingUser=$entityManager->getRepository('User')
    ->findOneBy(array('email' => $email));

    $newMemberRole = new MemberRole();
    $newMemberRole->setMember($existingUser);
    $newMemberRole->setRole($existingRole);
    $newMemberRole->setOrganization($existingOrg);
    $entityManager->persist($newMemberRole);
    try{
        $entityManager->flush();

        echo rsp_msg("USER_ADDED","user_added");

    }
    catch (Exception $e) {
        echo json_encode("error in adding user to org");
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }
}else if ($request_type == "CREATE_PROJ"){
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];
    $name = $_POST['name'];
    $organizationUuid = $_POST['org'];

    $existingOrg=$entityManager->getRepository('Organization')
    ->findOneBy(array('uuid' => $organizationUuid));

    $newProject = new Project();
    $newProject ->setName($name);
    $newProject ->setOrganization($existingOrg);
    $newProject ->setMosaics("");
    $newProject ->setOwners(true);

    $entityManager->persist($newProject);

    try{
        $entityManager->flush();
        echo rsp_msg("PROJ_CREATED","project created");

    }
    catch (Exception $e) {
        echo json_encode("error in creating project");
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }


}else if($request_type == "GET_PROJECTS"){
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];
    $organizationUuid = $_GET['organizationUuid'];

    try {
        $organization = $entityManager->getRepository('Organization')->findOneBy(array('uuid' => $organizationUuid));

        $response = array();

        // get projects
        $response["projects"] = array();
        foreach ($organization->getProjects() as $project) {
            array_push($response["projects"], $project->jsonSerialize());
        }

        echo rsp_msg("PROJECTS_RECEIVED", $response);
    } catch (Exception $e){
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }
}else if($request_type == "GET_MOSAICS"){
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];
    $projectUuid = $_GET['projectUuid'];

    try {
        $project = $entityManager->getRepository('Project')->findOneBy(array('uuid' => $projectUuid));

        $response = array();

        // get mosaics
        $response["mosaics"] = array();
        foreach ($project->getMosaics() as $mosaic) {
            array_push($response["mosaics"], $mosaic->jsonSerialize());
        }

        echo rsp_msg("MOSAICS_RECEIVED", $response);
    } catch (Exception $e){
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }
} else if($request_type == "CREATE_MOSAIC"){

    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];
    try{
        initiate_upload($uid, $entityManager);
    }
    catch (Exception $e) {
        echo json_encode("error in creating mosaic");
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }

} else if ($request_type == "UPLOAD_CHUNK") {

    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];
    process_chunk($uid);
//} else if ($request_type == "GET_MOSAICS"){
//
//    if($_SESSION["id"] != session_id()){
//        echo json_encode("USER NOT AUTHENTICATED");
//        return;
//    }
//
//    try {
//        $mosaicUuids = display_index($entityManager);
//        echo rsp_msg("MOSAIC_UUIDS_RECEIVED", $mosaicUuids);
//    } catch (Exception $e) {
//        echo rsp_msg("MOSAIC_UUIDS_RECEIVED_FAILED", "failed to retreive mosaic UUIDs for project");
//        echo 'Caught exception: ',  $e->getMessage(), "\n";
//    }
} else if($request_type == "GET_MOSAIC_CARD") {

    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    try {
        $response = get_mosaic_card($entityManager);
        echo rsp_msg("MOSAIC_CARD_RECEIVED", $response);
    } catch (Exception $e) {
        echo rsp_msg("MOSAIC_CARD_RECEIVED_FAILED", "failed to retrieve mosaic data for cards");
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }

} else if($request_type == "GET_MOSAIC") {

    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $mosaicUuid = $_GET['mosaicUuid'];

    try {
        $response = getMosaic($entityManager, $mosaicUuid);
        echo rsp_msg("MOSAIC_RECEIVED", $response);
    } catch (Exception $e) {
        echo rsp_msg("MOSAIC_RECEIVED_FAILED", "failed to retrieve mosaic data");
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }

} else if($request_type == "UPLOAD_ANNOTATION_CSV") {

    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    try {
        upload_annotation_csv($entityManager);
        echo rsp_msg("ANNOTATION_CSV_UPLOADED", "CSV containing annotations successfully uploaded");
    } catch (Exception $e) {
        echo rsp_msg("ANNOTATION_CSV_UPLOADED_FAILED", "failed to upload CSV with annotations");
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }

} else if ($request_type == "EXPORT_LABEL_CSV") {

    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

//    $label_id = $our_db->real_escape_string($_GET['label_id']);
//    $mosaic_id = $our_db->real_escape_string($_GET['mosaic_id']);
//    $export_type = $our_db->real_escape_string($_GET['export_type']);
//    $coord_type = $our_db->real_escape_string($_GET['coord_type']);

    $label_id = 1;
    $export_type = "RECTANGLES";
    $coord_type = "PIXEL";

    error_log("exporting label csv!");

    // get the mosaic that these annotations are for
    $mosaicUuid = $_GET['mosaicUuid'];

    try {
        $csv_contents = array();
        if ($export_type == "POLYGONS") {
//            export_polygons($label_id, $mosaic_id, $coord_type);
        } else if ($export_type == "RECTANGLES") {
            $csv_contents = export_rectangles($entityManager, $label_id, $coord_type, $mosaicUuid);
        } else if ($export_type == "LINES") {
//            export_lines($label_id, $mosaic_id, $coord_type);
        } else if ($export_type == "POINTS") {
//            export_points($label_id, $mosaic_id, $coord_type);
        }

        $response = array();
        $response["csv_contents"] = $csv_contents;
        echo rsp_msg("EXPORT_RECTANGLES_SUCCESS", $response);
    } catch (Exception $e) {
        echo rsp_msg("EXPORT_RECTANGLES_FAILURE", "failed to upload CSV with annotations");
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }

} else if($request_type == "CROP_MOSAIC"){
    echo rsp_msg("PLACEHOLDER","lorem ipsum");

} else if($request_type == "INTERFACE_MOSAIC"){
    echo rsp_msg("PLACEHOLDER","lorem ipsum");

} else if($request_type == "SUBMIT_TRAINING_JOB"){

    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    try {
        submit_training_job($entityManager);
        echo rsp_msg("SUBMIT_TRAINING_JOB_SUCCESS", "successfully submitted training job");
    } catch (Exception $e) {
        echo rsp_msg("SUBMIT_TRAINING_JOB_FAILURE", "failed to submit training job");
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }

    echo rsp_msg("PLACEHOLDER","lorem ipsum");
}




function rsp_msg($code,$message){
    return json_encode(["code" => $code , "message" => $message ]);
}

// function generateJWT($id){
//     global $secret_key;
//     $payload = array(
//         "id" -> $id
//     );

//     error_log(json_encode($secret_key));

//     $jwt = JWT::encode($payload, $secret_key);
//     return $jwt;
// }

?>
