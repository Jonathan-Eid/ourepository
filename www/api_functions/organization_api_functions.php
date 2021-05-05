<?php

require_once "../apis/api_v2.php";

/**
 * @throws \Doctrine\ORM\OptimisticLockException
 * @throws \Doctrine\ORM\ORMException
 */
function createProject($projectName, $organizationUuid) {
    global $entityManager;

    // get the organization to make this project in
    $existingOrg = $entityManager->getRepository('Organization')
        ->findOneBy(array('uuid' => $organizationUuid));

    // make the new project
    $newProject = new Project();
    $newProject->setName($projectName);
    $newProject->setOrganization($existingOrg);
    $newProject->setMosaics("");
    $newProject->setOwners(true);

    $entityManager->persist($newProject);
    $entityManager->flush();

    return responseMessage("SUCCESS", "");
}

/**
 * @throws \Doctrine\ORM\OptimisticLockException
 * @throws \Doctrine\ORM\ORMException
 */
function addUser($role, $email) {
    global $entityManager;

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
    $entityManager->flush();

    return responseMessage("SUCCESS", "");
}

function getOrganization($uid, $organizationUuid) {
    global $entityManager;

    $query = $entityManager->createQuery('SELECT o FROM organizations o JOIN o.memberRoles m WHERE m.member = ' . $uid . ' AND  o.uuid = \'' . $organizationUuid . '\'');

    $organizations = $query->getResult();
    if (!isset($organizations)) {
        return responseMessage("FAILURE", "No organization found.");
    }

    $responseObject = array();
    $responseObject["organization"] = $organizations[0];

    return responseMessage("SUCCESS", $responseObject);
}

function getProjects($organizationUuid) {
    global $entityManager;

    $organization = $entityManager->getRepository('Organization')->findOneBy(array('uuid' => $organizationUuid));

    $responseObject = array();

    // get projects
    $responseObject["projects"] = array();
    foreach ($organization->getProjects() as $project) {
        array_push($responseObject["projects"], $project->jsonSerialize());
    }

    return responseMessage("SUCCESS", $responseObject);
}

function hasOrgPermission($uid, $permission, $organizationUuid) {
    global $entityManager;

    $query = $entityManager->createQuery('SELECT o FROM OrgACL o JOIN o.organization g WITH g.uuid = :org JOIN g.memberRoles m WITH m.member = :uid AND m.role = o.role WHERE o.permission IN (:permissions)');
    $query->setParameter('org', $organizationUuid);
    $query->setParameter('uid', $uid);
    $query->setParameter('permissions', array('all', $permission));

    $acls = $query->getResult();
    if (!isset($acls)) {
        return responseMessage("FAILURE", "The user does not have the proper permissions.");
    }

    $responseObject = array();
    $responseObject["acls"] = $acls;

    return responseMessage("SUCCESS", $responseObject);

}

function getOrgRoles($uid, $organizationUuid) {
    global $entityManager;

    $query = $entityManager->createQuery('SELECT r FROM Role r JOIN r.organization g WITH g.uuid = :org JOIN g.memberRoles m WITH m.member = :uid');
    $query->setParameter('org', $organizationUuid);
    $query->setParameter('uid', $uid);


    $roles = $query->getResult();
    if (!isset($roles)) {
        return responseMessage("FAILURE", "Failed to retrieves roles from organization");
    }

    $responseObject = array();
    $responseObject["roles"] = $roles;

    return responseMessage("SUCCESS", $responseObject);
}

function getOrganizationUsers($organizationUuid) {
    global $entityManager;

    $query = $entityManager->createQuery('SELECT m FROM MemberRole m JOIN m.organization g WITH g.uuid = :org JOIN m.member r');
    $query->setParameter('org', $organizationUuid);

    $users = $query->getResult();
    if (!isset($users)) {
        return responseMessage("FAILURE", "Failed to retrieves users from organization");
    }

    $responseObject = array();
    $responseObject["users"] = $users;

    return responseMessage("SUCCESS", $responseObject);
}

function getRolePermissions($roleId) {
    global $entityManager;

    $query = $entityManager->createQuery('SELECT a FROM OrgACL a JOIN a.role r WITH r.id = :role_id');
    $query->setParameter('role_id', $roleId);

    $roles = $query->getResult();
    if (!isset($roles)) {
        return responseMessage("FAILURE", "Failed to retrieve permissions for this role");
    }

    $responseObject = array();
    $responseObject["roles"] = $roles;

    return responseMessage("SUCCESS", $responseObject);
}

/**
 * @throws \Doctrine\ORM\OptimisticLockException
 * @throws \Doctrine\ORM\ORMException
 */
function changeRolePermissions($uid, $roleId, $changes) {
    global $entityManager;

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

    $query = $entityManager->createQuery('SELECT o FROM organizations o JOIN o.memberRoles m WHERE m.member = ' . $uid . ' AND  m.role = \'' . $roleId . '\'');
    $organization = $query->getResult()[0];
    error_log(json_encode($organization));
    $role = $entityManager->getRepository('Role')
        ->findOneBy(array('id' => $roleId));

    foreach ($changeObj as $key => $value) {

        error_log($key . " => " . $value);

        if ($value) {
            $newOrgACL = new OrgACL();
            $newOrgACL->setOrganization($organization);
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

    $responseObject = array();
    $responseObject["roles"] = $roles;

    return responseMessage("SUCCESS", $responseObject);
}

/**
 * @throws \Doctrine\ORM\OptimisticLockException
 * @throws \Doctrine\ORM\ORMException
 */
function addRole($uid, $roleName, $changes, $organizationUuid) {
    global $entityManager;

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

    $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WITH m.member = :uid WHERE o.uuid = :organizationUuid');
    $query->setParameter('organizationUuid', $organizationUuid);
    $query->setParameter('uid', $uid);

    $organization = $query->getResult()[0];
    error_log(json_encode($organization));
    $role = new Role();
    $role->setName($roleName);
    $role->setOrganization($organization);

    $entityManager->persist($role);

    foreach ($changeObj as $key => $value) {

        error_log($key . " => " . $value);

        if ($value) {
            $newOrgACL = new OrgACL();
            $newOrgACL->setOrganization($organization);
            $newOrgACL->setRole($role);
            $newOrgACL->setPermission($key);

            $entityManager->persist($newOrgACL);
            $entityManager->flush();
        }
    }

    $responseObject = array();
    $responseObject["roles"] = $roles;

    return responseMessage("SUCCESS", $responseObject);
}

/**
 * @throws \Doctrine\ORM\OptimisticLockException
 * @throws \Doctrine\ORM\ORMException
 */
function deleteRole($uid, $roleId) {
    global $entityManager;

    $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WHERE m.member = ' . $uid . ' AND  m.role = \'' . $roleId . '\'');
    $organization = $query->getResult()[0];
    error_log(json_encode($organization));
    $role = $entityManager->getRepository('Role')
        ->findOneBy(array('id' => $roleId));
    if (!isset($role)) {
        return;
    }

    $entityManager->remove($role);
    $entityManager->flush();

    $responseObject = array();
    $responseObject["role"] = $role;

    return responseMessage("SUCCESS", $responseObject);
}