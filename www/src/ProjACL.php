<?php
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity 
 * @ORM\Table(name="proj_acl")
 */
class ProjACL
{


    /** @ORM\Id 
     * @ORM\Column(type="integer") 
     * @ORM\GeneratedValue */
    protected $id;

    /** @ORM\Column(type="string") */
    protected $entityId;

    /** @ORM\Column(type="string") */
    protected $listType;
    
    /** @ORM\Column(type="string") */
    protected $entityType;

    /** @ORM\Column(type="string") */
    protected $project;


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
}