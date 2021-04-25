<?php

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

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

    /** @ORM\Column(type="string") */
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

    public function __construct() {
        $this->proj_Acls = new ArrayCollection();


        

    }

    public function getId()
    {
        return $this->id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function setOrganization($organization){
        $this->organization = $organization;
    }

    public function getOrganization(){
        return $this->organization;
    }

    public function setMosaics($mosaics){
        $this->mosaics = $mosaics;
    }

    public function getMosaics(){
        return $this->mosaics;
    }

    public function setOwners($owners){
        $this->owners = $owners;
    }

    public function getOwners(){
        return $this->owners;
    }

    public function jsonSerialize()
    {
        return array(
            'id' => $this->id,
            'name' => $this->name,
            'mosaics' => $this->mosaics
        );
    }
}