<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 1000");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding");
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
if (isset($_POST['id_token'])) {
    $id_token = $_POST['id_token'];
    $request_type = $_POST['request'];
    echo json_encode($_POST['name']);

} else {
    error_log(json_encode("GOTTEN HERE"));

    $id_token = $_GET['id_token'];
    $request_type = $_GET['request'];

}

if($request_type == "CREATE_USER"){
    //TODO: Check if User is already created
    $newUser = new User();

    $email = $_GET['email'];
    $password = $_POST['password'];
    $shake = $_POST['shake'];

    $newUser->setName($_POST['email']);
    $newUser->setShake($_POST['shake']);

    $hash = hash_pbkdf2("sha256", $password, $shake, 16, 20);

    $newUser->setHash($_POST['email']);
    $newUser->setAdmin(false);
    $entityManager->persist($newUser);
    try{
        $entityManager->flush();
        echo "SUCCESSFULLY CREATED USER";

    }
    catch (Exception $e) {
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }



}

// if(!isset($id_token)){
//     return; 
// }


// $entityManager->persist($newOrgACL);
// $entityManager->flush();




// $newMemberRole = new MemberRole();
// $newMemberRole->setMember($newUser);
// $newMemberRole->setOrganization($newOrganization);


// $entityManager->persist($newMemberRole);
// $entityManager->flush();
?>
