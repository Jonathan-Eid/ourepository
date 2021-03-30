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
    $given_name = $_POST['given_name'];
    $family_name = $_POST['family_name'];


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
    $newOrgACL->setPermission("all");
    $newOrgACL->setRole($adminRole);
    $entityManager->persist($newOrgACL);

    $newOrganization = new Organization();
    $newOrganization->addMemberRole($newMemberRole);
    $newOrganization->addOrgACL($newOrgACL);
    $newOrganization->addRole($adminRole);
    $newOrganization->addRole($defaultRole);
    $newOrganization->setName($org_name);
    $newOrganization->setVisible($visible);

    $newMemberRole->setOrganization($newOrganization);
    $newRole->setOrganization($newOrganization);
    $newRole2->setOrganization($newOrganization);
    $newOrgACL->setOrganization($newOrganization);

    $entityManager->persist($newOrganization);

    try{
        $entityManager->flush();

        echo rsp_msg("ORG_CREATED","org_created");

    }
    catch (Exception $e) {
        echo json_encode("error in org creation");
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }

}else if($request_type == "GET_ORGS"){
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];


    $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WHERE m.member = '.$uid);

    $orgs = $query->getResult();

    if(isset($orgs)){
        echo rsp_msg("ORGS_RECEIVED_FAILED",(string)$_SESSION['uid']);
        return;
    }

    error_log($orgs[0]->getName());

    echo rsp_msg("ORGS_RECEIVED",$orgs);
}else if($request_type == "ADD_USER"){
    
    if($_SESSION["id"] != session_id()){
        echo json_encode("USER NOT AUTHENTICATED");
        return;
    }

    $uid = $_SESSION['uid'];
    $role = $_POST['role'];
    $email = $_POST['email'];
    $org_name = $_POST['org'];
    

    $existingOrg=$entityManager->getRepository('Organization')
    ->findOneBy(array('name' => $org_name));
    
    $existingRole=$entityManager->getRepository('Role')
    ->findOneBy(array('name' => $role, 'organization' => $existingOrg));

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
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }
    
}


function rsp_msg($code,$message){
    return json_encode(["code" => $code , "message" => $message ]);
}

function generateJWT($id){
    global $secret_key;
    $payload = array(
        "id" -> $id
    );

    error_log(json_encode($secret_key));

    $jwt = JWT::encode($payload, $secret_key);
    return $jwt;
}

?>
