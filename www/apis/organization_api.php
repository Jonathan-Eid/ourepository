<?php

require_once "api_v2.php";
require_once "../api_functions/organization_api_functions.php";

/**
 * @throws \Doctrine\ORM\OptimisticLockException
 * @throws \Doctrine\ORM\ORMException
 */
function handleOrganizationRequest($request_type) {

    switch ($request_type) {

        case "CREATE_PROJECT":
            if (!enforceAuth()) return;

            $projectName = $_POST['projectName'];
            $organizationUuid = $_POST['organizationUuid'];
            
            $response = createProject($projectName, $organizationUuid);
            echo $response;
            break;
            
        case "ADD_USER":
            if (!enforceAuth()) return;

            $role = $_POST['role'];
            $email = $_POST['email'];

            $response = createProject($role, $email);
            echo $response;
            break;
            
        case "GET_ORGANIZATION":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];
            $organizationUuid = $_GET['organizationUuid'];

            $response = getOrganization($uid, $organizationUuid);
            echo $response;
            break;

        case "GET_PROJECTS":
            if (!enforceAuth()) return;

            $organizationUuid = $_GET['organizationUuid'];

            $response = getProjects($organizationUuid);
            echo $response;
            break;

        case "HAS_ORGANIZATION_PERMISSION":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];
            $permission = $_GET['permission'];
            $organizationUuid = $_GET['organizationUuid'];

            $response = hasOrgPermission($uid, $permission, $organizationUuid);
            echo $response;
            break;



        case "GET_ORGANIZATION_ROLES":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];
            $organizationUuid = $_GET['organizationUuid'];
            
            $response = getOrgRoles($uid, $organizationUuid);
            echo $response;
            break;

        case "GET_ORGANIZATION_USERS":
            if (!enforceAuth()) return;

            $organizationUuid = $_GET['organizationUuid'];

            $response = getOrganizationUsers($organizationUuid);
            echo $response;
            break;

        case "GET_ROLE_PERMISSIONS":
            if (!enforceAuth()) return;

            $roleId = $_GET['roleId'];

            $response = getRolePermissions($roleId);
            echo $response;
            break;

        case "CHANGE_ROLE_PERMISSIONS":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];
            $roleId = $_POST['roleId'];
            $changes = $_POST['changes'];

            $response = changeRolePermissions($uid, $roleId, $changes);
            echo $response;
            break;

        case "ADD_ROLE":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];
            $roleName = $_POST['roleName'];
            $changes = $_POST['changes'];
            $organizationUuid = $_POST['organizationUuid'];

            $response = addRole($uid, $roleName, $changes, $organizationUuid);
            echo $response;
            break;

        case "DELETE_ROLE":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];
            $roleId = $_POST['roleId'];

            $response = deleteRole($uid, $roleId);
            echo $response;
            break;
    }
}