<?php

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Ramsey\Uuid\Uuid;

/**
 * @ORM\Entity 
 * @ORM\Table(name="projects")
 */
class Project implements JsonSerializable
{
    /** @ORM\Id 
     * @ORM\Column(type="integer") 
     * @ORM\GeneratedValue */
    protected $id;

    /** @ORM\Column(type="string") */
    protected $name;

    /**
     * @ORM\OneToMany(targetEntity="Mosaic", mappedBy="project")
     */
    protected $mosaics;

    /**
     * @ORM\OneToMany(targetEntity="ProjACL", mappedBy="project")
     */
    protected $proj_Acls;
    
    /**
     * Many projects have one Organization. This is the owning side.
     * @ORM\ManyToOne(targetEntity="Organization")
     */
    protected $organization;

    /** @ORM\Column(type="boolean") */
    protected $owners;


    /** 
     * @var \Ramsey\Uuid\UuidInterface
     * @ORM\Column(type="uuid", unique=true)
     */
    protected $uuid;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getMosaics()
    {
        return $this->mosaics;
    }

    /**
     * @param mixed $mosaics
     */
    public function setMosaics($mosaics)
    {
        $this->mosaics = $mosaics;
    }

    /**
     * @return mixed
     */
    public function getProjAcls()
    {
        return $this->proj_Acls;
    }

    /**
     * @param mixed $proj_Acls
     */
    public function setProjAcls($proj_Acls)
    {
        $this->proj_Acls = $proj_Acls;
    }

    /**
     * @return mixed
     */
    public function getOrganization()
    {
        return $this->organization;
    }

    /**
     * @param mixed $organization
     */
    public function setOrganization($organization)
    {
        $this->organization = $organization;
    }

    /**
     * @return mixed
     */
    public function getOwners()
    {
        return $this->owners;
    }

    /**
     * @param mixed $owners
     */
    public function setOwners($owners)
    {
        $this->owners = $owners;
    }

    /**
     */
    public function getUuid()
    {
        return $this->uuid;
    }

    /**
     */
    public function setUuid($uuid)
    {
        $this->uuid = $uuid;
    }



    public function __construct() {
         $this->proj_Acls = new ArrayCollection();
         $this->uuid = Uuid::uuid4()->toString();
         $this->mosaics = new ArrayCollection();
    }

    public function jsonSerialize()
    {
        return array(
            'uuid' => $this->uuid,
            'name' => $this->name
        );
    }
}