<?php

require_once "api_v2.php";
require_once "../bootstrap.php";

function handleUserRequest($request_type) {

    global $entityManager;

    switch ($request_type) {

        case "GET_AUTH":

            error_log(session_id() . "SESSION" . $_SESSION["id"]);

            if ($_SESSION["id"] == session_id()) {
                echo json_encode("true");
            } else {
                echo json_encode("false");

            }
            break;

        case "CREATE_USER":

            $email = $_POST['email'];
            $username = $_POST['username'];
            $given_name = $_POST['givenName'];
            $family_name = $_POST['familyName'];


            $existingUser = $entityManager->getRepository('User')
                ->findOneBy(array('email' => $email));


            if (isset($existingUser)) {
                error_log(json_encode($existingUser->getEmail()));
                error_log("USER EXISTS");
                echo rsp_msg("user_exists", "A user with this email already exists");
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

            try {
                $entityManager->flush();

                $existingUser = $entityManager->getRepository('User')
                    ->findOneBy(array('email' => $email));
                error_log("USER EXISTS");

                $_SESSION["uid"] = $existingUser->getId();
                $_SESSION["id"] = session_id();
                echo rsp_msg("created_user", $_SESSION["id"]);

            } catch (Exception $e) {
                echo 'Caught exception: ', $e->getMessage(), "\n";
            }

            break;

        case "LOGIN_USER":

            $email = $_POST['email'];
            error_log(json_encode("email: " . $_POST['email']));

            $existingUser = $entityManager->getRepository('User')
                ->findOneBy(array('email' => $email));

            $password = $_POST['password'];

            if (isset($existingUser)) {
                error_log(json_encode("SESSION COUNT: " . $_SESSION["count"]));
                $shake = $existingUser->getShake();

                $checkHash = hash_pbkdf2("sha256", $password, $shake, 16, 20);

                if ($checkHash == $existingUser->getHash()) {
                    error_log("USER EXISTS");
                    $_SESSION["uid"] = $existingUser->getId();
                    $_SESSION["id"] = session_id();
                    echo rsp_msg("hash_matches", $_SESSION["id"]);
                    return;
                }

            } else {

                echo json_encode(session_id());
                return;

            }

            break;

        case "LOGOUT_USER":
            if (!enforceAuth()) return;

            session_unset();
            session_destroy();
            echo json_encode("true");

            break;

        case "GET_ORGS":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];

            try {
                $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WHERE m.member = ' . $uid);
                $orgs = $query->getResult();
                if (count($orgs) == 0) {
                    echo rsp_msg("ORGS_RECEIVED_FAILED", "no orgs were returned in the query");
                    return;
                }

                $response = array();

                // get organizations
                $response["organizations"] = array();
                foreach ($orgs as $organizationUuid) {
                    array_push($response["organizations"], $organizationUuid->jsonSerialize());
                }

                echo rsp_msg("ORGS_RECEIVED", $response);
            } catch (Exception $e) {
                echo 'Caught exception: ', $e->getMessage(), "\n";
            }

            break;

        case "GET_SIDEBAR_ORGS":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];

            try {
                $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WHERE m.member = ' . $uid);
                $orgs = $query->getResult();
                if (count($orgs) == 0) {
                    echo rsp_msg("SIDEBAR_ORGS_FAILED", "no orgs were returned in the query");
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
            } catch (Exception $e) {
                echo 'Caught exception: ', $e->getMessage(), "\n";
            }

            break;

        case "CREATE_ORG":
            if (!enforceAuth()) return;

            global $org_perm_map;

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
//            $newOrganization->addMemberRole($newMemberRole);
//            $newOrganization->addOrgACL($newOrgACL);
//            $newOrganization->addRole($adminRole);
//            $newOrganization->addRole($defaultRole);
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

            break;
    }
}