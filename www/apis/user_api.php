<?php

require_once "api_v2.php";
require_once "../util_v2/user_utils.php";

function handleUserRequest($request_type) {

    global $entityManager;

    try {
        switch ($request_type) {

            case "GET_AUTH":
                if ($_SESSION["id"] == session_id()) {
                    echo json_encode("true");
                } else {
                    echo json_encode("false");
                }

                break;

            case "CREATE_USER":
                $email = $_POST['email'];
                $givenName = $_POST['givenName'];
                $familyName = $_POST['familyName'];
                $password = $_POST['password'];
                $shake = $_POST['shake'];

                $response = createUser($email, $givenName, $familyName, $password, $shake);
                echo $response;

                break;

            case "LOGIN_USER":
                $email = $_POST['email'];
                $password = $_POST['password'];

                $response = loginUser($email, $password);
                echo $response;

                break;

            case "LOGOUT_USER":
                if (!enforceAuth()) return;

                session_unset();
                session_destroy();

                $response = responseMessage("SUCCESS", "");
                echo $response;

                break;

            case "GET_ORGANIZATIONS":
                if (!enforceAuth()) return;

                $uid = $_SESSION['uid'];

                $response = getOrganizations($uid);
                echo $response;

                break;

            case "GET_SIDEBAR_ORGANIZATIONS":
                
                if (!enforceAuth()) return;

                $uid = $_SESSION['uid'];
                
                $response = getSidebarOrganizations($uid);
                echo $response;

                break;

            case "CREATE_ORGANIZATION":
                if (!enforceAuth()) return;

                $uid = $_SESSION['uid'];
                $organizationName = $_POST['organizationName'];;
                $visible = $_POST['visible'];

                $response = createOrganization($uid, $organizationName, $visible);
                echo $response;
                break;
        }
    } catch (Throwable $t) {
        error_log($t->getMessage());
        echo responseMessage("ERROR", "something went wrong");
    }
}