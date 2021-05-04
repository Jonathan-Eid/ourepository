<?php

require_once "api_v2.php";

function handleOrganizationRequest($request_type) {

    global $entityManager;

    switch ($request_type) {

        case "CREATE_PROJ":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];
            $name = $_POST['name'];
            $organizationUuid = $_POST['org'];

            $existingOrg = $entityManager->getRepository('Organization')
                ->findOneBy(array('uuid' => $organizationUuid));

            $newProject = new Project();
            $newProject->setName($name);
            $newProject->setOrganization($existingOrg);
            $newProject->setMosaics("");
            $newProject->setOwners(true);

            $entityManager->persist($newProject);

            try {
                $entityManager->flush();
                echo responseMessage("PROJ_CREATED", "project created");

            } catch (Exception $e) {
                echo json_encode("error in creating project");
                echo 'Caught exception: ', $e->getMessage(), "\n";
            }

            break;

        case "ADD_USER":
            if (!enforceAuth()) return;

            $role = $_POST['role'];
            $email = $_POST['email'];

            $existingRole = $entityManager->getRepository('Role')
                ->findOneBy(array('id' => $role));

            $existingOrg = $existingRole->getOrganization();

            $existingUser = $entityManager->getRepository('User')
                ->findOneBy(array('email' => $email));

            $newMemberRole = new MemberRole();
            $newMemberRole->setMember($existingUser);
            $newMemberRole->setRole($existingRole);
            $newMemberRole->setOrganization($existingOrg);
            $entityManager->persist($newMemberRole);
            try {
                $entityManager->flush();

                echo responseMessage("USER_ADDED", "user_added");

            } catch (Exception $e) {
                echo json_encode("error in adding user to org");
                echo 'Caught exception: ', $e->getMessage(), "\n";
            }

            break;

        case "GET_AUTH_ORG_BY_UUID":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];
            $oid = $_GET['uuid'];

            try {

                $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WHERE m.member = ' . $uid . ' AND  o.uuid = \'' . $oid . '\'');
                $orgs = $query->getResult();
                if (!isset($orgs)) {
                    echo responseMessage("ORGS_RECEIVED_FAILED", "no orgs were returned in the query");
                    return;
                }
                echo responseMessage("ORGS_RECEIVED", $orgs[0]);
            } catch (Throwable $t) {
                error_log($t->getMessage());
                echo responseMessage("ERROR", "something went wrong");
            }

            break;

        case "GET_PROJECTS":
            if (!enforceAuth()) return;

            $organizationUuid = $_GET['organizationUuid'];

            try {
                $organization = $entityManager->getRepository('Organization')->findOneBy(array('uuid' => $organizationUuid));

                $response = array();

                // get projects
                $response["projects"] = array();
                foreach ($organization->getProjects() as $project) {
                    array_push($response["projects"], $project->jsonSerialize());
                }

                echo responseMessage("PROJECTS_RECEIVED", $response);
            } catch (Throwable $t) {
                error_log($t->getMessage());
                echo responseMessage("ERROR", "something went wrong");
            }
            break;

        case "HAS_ORG_PERMISSION":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];
            $permission = $_GET['permission'];
            $organization = $_GET['organization'];

            try {

                $query = $entityManager->createQuery('SELECT o FROM OrgACL o JOIN o.organization g WITH g.uuid = :org JOIN g.memberRoles m WITH m.member = :uid AND m.role = o.role WHERE o.permission IN (:permissions)');
                $query->setParameter('org', $organization);
                $query->setParameter('uid', $uid);
                $query->setParameter('permissions', array('all', $permission));


                $acls = $query->getResult();
                if (!isset($acls)) {
                    echo responseMessage("NO_ORG_PERMISSION", "The user does not have the proper permissions");
                    return;
                }
                echo responseMessage("HAS_ORG_PERMISSION", $acls);
            } catch (Exception $e) {
                echo 'Caught exception: ', $e->getMessage(), "\n";

            }

            break;

        case "GET_ORG_ROLES":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];
            $organization = $_GET['organization'];

            try {
                $query = $entityManager->createQuery('SELECT r FROM Role r JOIN r.organization g WITH g.uuid = :org JOIN g.memberRoles m WITH m.member = :uid');
                $query->setParameter('org', $organization);
                $query->setParameter('uid', $uid);


                $roles = $query->getResult();
                if (!isset($roles)) {
                    echo responseMessage("NO_ORG_ROLE", "Failed to retrieves roles from organization");
                    return;
                }
                echo responseMessage("ORG_ROLES_RECEIVED", $roles);
            } catch (Throwable $t) {
                error_log($t->getMessage());
                echo responseMessage("ERROR", "something went wrong");
            }

            break;

        case "GET_ORG_USERS":
            if (!enforceAuth()) return;

            $organization = $_GET['organization'];

            try {
                $query = $entityManager->createQuery('SELECT m FROM MemberRole m JOIN m.organization g WITH g.uuid = :org JOIN m.member r');
                $query->setParameter('org', $organization);


                $users = $query->getResult();
                if (!isset($users)) {
                    echo responseMessage("NO_ORG_USER", "Failed to retrieves users from organization");
                    return;
                }
                echo responseMessage("ORG_USERS_RECEIVED", $users);
            } catch (Throwable $t) {
                error_log($t->getMessage());
                echo responseMessage("ERROR", "something went wrong");
            }
            break;

        case "GET_ROLE_PERMISSIONS":
            if (!enforceAuth()) return;

            $roleId = $_GET['roleId'];

            try {

                $query = $entityManager->createQuery('SELECT a FROM OrgACL a JOIN a.role r WITH r.id = :role_id');
                $query->setParameter('role_id', $roleId);

                $roles = $query->getResult();
                if (!isset($roles)) {
                    echo responseMessage("NO_ROLE_PERMISSIONS", "Failed to retrieve permissions for this role");
                    return;
                }
                echo responseMessage("ROLE_PERMISSIONS_RECEIVED", $roles);
            } catch (Exception $e) {
                echo 'Caught exception: ', $e->getMessage(), "\n";

            }

            break;

        case "CHANGE_ROLE_PERMISSIONS":
            if (!enforceAuth()) return;

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

            if (!isset($changes)) {
                return;
            }

            try {
                $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WHERE m.member = ' . $uid . ' AND  m.role = \'' . $roleId . '\'');
                $organizationUuid = $query->getResult()[0];
                error_log(json_encode($organizationUuid));
                $role = $entityManager->getRepository('Role')
                    ->findOneBy(array('id' => $roleId));

                foreach ($changeObj as $key => $value) {

                    error_log($key . " => " . $value);

                    if ($value) {
                        $newOrgACL = new OrgACL();
                        $newOrgACL->setOrganization($organizationUuid);
                        $newOrgACL->setRole($role);
                        $newOrgACL->setPermission($key);

                        $entityManager->persist($newOrgACL);
                    } else {
                        $query = $entityManager->createQuery('SELECT a FROM OrgACL a JOIN a.role r WITH r.id = :role_id WHERE a.permission = :permission');
                        $query->setParameter('permission', $key);
                        $query->setParameter('role_id', $roleId);

                        $res = $query->getResult()[0];
                        $entityManager->remove($res);
                        $entityManager->flush();
                    }
                }

                echo responseMessage("ROLE_PERMISSIONS_CHANGED", $roles);
            } catch (Exception $e) {
                error_log(json_encode($e));
            }

            break;

        case "ADD_ROLE":
            if (!enforceAuth()) return;

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

            if (!isset($changes)) {
                return;
            }

            try {
                $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WITH m.member = :uid WHERE o.uuid = :organization');
                $query->setParameter('organization', $organization);
                $query->setParameter('uid', $uid);

                $organizationUuid = $query->getResult()[0];
                error_log(json_encode($organizationUuid));
                $role = new Role();
                $role->setName($roleName);
                $role->setOrganization($organizationUuid);

                $entityManager->persist($role);

                foreach ($changeObj as $key => $value) {

                    error_log($key . " => " . $value);

                    if ($value) {
                        $newOrgACL = new OrgACL();
                        $newOrgACL->setOrganization($organizationUuid);
                        $newOrgACL->setRole($role);
                        $newOrgACL->setPermission($key);

                        $entityManager->persist($newOrgACL);
                        $entityManager->flush();
                    }
                }

                echo responseMessage("ROLE_ADDED", $roles);
            } catch (Exception $e) {
                error_log(json_encode($e));
            }

            break;

        case "DELETE_ROLE":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];
            $roleId = $_POST['roleId'];

            try {
                $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WHERE m.member = ' . $uid . ' AND  m.role = \'' . $roleId . '\'');
                $organizationUuid = $query->getResult()[0];
                error_log(json_encode($organizationUuid));
                $role = $entityManager->getRepository('Role')
                    ->findOneBy(array('id' => $roleId));
                if (!isset($role)) {
                    return;
                }

                $entityManager->remove($role);
                $entityManager->flush();

                echo responseMessage("ROLE_DELETED", $role);
            } catch (Exception $e) {
                error_log(json_encode($e));
            }

            break;
    }
}