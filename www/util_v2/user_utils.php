<?php

require_once "../apis/api_v2.php";

/**
 * @throws \Doctrine\ORM\OptimisticLockException
 * @throws \Doctrine\ORM\ORMException
 */
function createUser($email, $givenName, $familyName, $password, $shake) {
    global $entityManager;

    // determine if a user exists with the same email
    $existingUser = $entityManager->getRepository('User')
        ->findOneBy(array('email' => $email));

    // if a user exists with the same email, do not continue
    if (isset($existingUser)) {
        return responseMessage("USER_ALREADY_EXISTS", "A user with this email already exists");
    }

    // otherwise, create a new user

    $newUser = new User();

    $newUser->setEmail($email);
    $newUser->setShake($shake);

    $newUser->setGivenName($givenName);
    $newUser->setFamilyName($familyName);

    $newUser->setEmail($email);
    $newUser->setShake($shake);
    $newUser->setDescription("");

    $hash = hash_pbkdf2("sha256", $password, $shake, 16, 20);

    $newUser->setHash($hash);
    $newUser->setAdmin(false);

    $entityManager->persist($newUser);
    $entityManager->flush();

    $_SESSION["uid"] = $existingUser->getId();
    $_SESSION["id"] = session_id();
    return responseMessage("USER_CREATED", $_SESSION["id"]);
}

function loginUser($email, $password) {
    global $entityManager;

    // determine if a user exists with the same email
    $existingUser = $entityManager->getRepository('User')
        ->findOneBy(array('email' => $email));

    // if a user exists with the same email, try to log in
    if (isset($existingUser)) {
        $shake = $existingUser->getShake();

        $checkHash = hash_pbkdf2("sha256", $password, $shake, 16, 20);

        if ($checkHash == $existingUser->getHash()) {
            $_SESSION["uid"] = $existingUser->getId();
            $_SESSION["id"] = session_id();
            return responseMessage("SUCCESS", $_SESSION["id"]);
        } else {
            return responseMessage("WRONG_PASSWORD", $_SESSION["id"]);
        }

    } else {
        return responseMessage("USER_NOT_EXISTS", "No user found with the given email");
    }
}

function getOrganizations($uid) {
    global $entityManager;

    $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WHERE m.member = ' . $uid);
    $organizations = $query->getResult();

    $responseObject = array();

    // get organizations
    $responseObject["organizations"] = array();
    foreach ($organizations as $organizationUuid) {
        array_push($responseObject["organizations"], $organizationUuid->jsonSerialize());
    }

    return responseMessage("SUCCESS", $responseObject);
}

function getSidebarOrganizations($uid) {
    global $entityManager;

    $query = $entityManager->createQuery('SELECT o FROM Organization o JOIN o.memberRoles m WHERE m.member = ' . $uid);
    $organizations = $query->getResult();

    $responseObject = array();

    // get organizations that contain projects that contain mosaics
    $responseObject["organizations"] = array();
    $i = 0;
    foreach ($organizations as $organization) {
        array_push($responseObject["organizations"], $organization->jsonSerialize());
        $projects = $organization->getProjects();

        $responseObject["organizations"][$i]["projects"] = array();
        foreach ($projects as $project) {
            array_push($responseObject["organizations"][$i]["projects"], $project->jsonSerialize());
        }
        $i++;
    }

    return responseMessage("SUCCESS", $responseObject);
}

/**
 * @throws \Doctrine\ORM\OptimisticLockException
 * @throws \Doctrine\ORM\ORMException
 */
function createOrganization($uid, $organizationName, $visible) {
    global $entityManager, $org_perm_map;

    $existingUser = $entityManager->getRepository('User')
        ->findOneBy(array('id' => $uid));

    $adminRole = new Role();
    $adminRole->setName("admin");
    $entityManager->persist($adminRole);

    $defaultRole = new Role();
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
    $newOrganization->setName($organizationName);
    $newOrganization->setVisible($visible);

    $newMemberRole->setOrganization($newOrganization);
    $adminRole->setOrganization($newOrganization);
    $defaultRole->setOrganization($newOrganization);
    $newOrgACL->setOrganization($newOrganization);
    $defaultACL->setOrganization($newOrganization);

    $entityManager->persist($newOrganization);

    $entityManager->flush();

    $responseObject = array();
    $responseObject["organizationUuid"] = $newOrganization->getUuid();
    return responseMessage("SUCCESS", $responseObject);
}