  
<?php
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Ramsey\Uuid\Uuid;
/**
 * @ORM\Entity 
 * @ORM\Table(name="organizations")
 */
class Organization implements JsonSerializable
{
    /** @ORM\Id 
     * @ORM\Column(type="integer") 
     * @ORM\GeneratedValue */
    protected $id;

    /** @ORM\Column(type="string") */
    protected $name;

    /** @ORM\Column(type="boolean") */
    protected $visible;

    /**
     * @ORM\OneToMany(targetEntity="OrgACL", mappedBy="organization")
     */
    protected $orgAcls;

    /**
     * @ORM\OneToMany(targetEntity="MemberRole", mappedBy="organization")
     */
    protected $memberRoles;

    /**
     * @ORM\OneToMany(targetEntity="Role", mappedBy="organization")
     */
    protected $roles;


    /** 
     * @var \Ramsey\Uuid\UuidInterface
     * @ORM\Column(type="uuid", unique=true)
     */
    protected $uuid;

    // /** @ORM\Column(type="boolean") */
    // protected $projects;

    /** @ORM\OneToMany(targetEntity="Label", mappedBy="organization") */
    private $labels;

    public function __construct() {
        $this->orgAcls = new ArrayCollection();
        $this->memberRoles = new ArrayCollection();
        $this->roles = new ArrayCollection();
        $this->uuid = Uuid::uuid4()->toString();
        $this->labels = new ArrayCollection();
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

    public function setVisible($visible)
    {
        $this->visible = $visible;
    }

    public function addOrgACL($acl)
    {
        $this->orgAcls->add($acl);
    }

    public function addMemberRole($memberRole)
    {
        $this->memberRoles->add($memberRole);
    }

    public function addRole($role)
    {
        $this->roles->add($role);
    }

    

    public function jsonSerialize()
    {
        return array(
            'name' => $this->name,
            'visible'=> $this->visible,
            'uuid'=> $this->uuid
        );
    }

    /**
     * @return mixed
     */
    public function getLabels()
    {
        return $this->labels;
    }

    /**
     * @param mixed $labels
     */
    public function setLabels($labels)
    {
        $this->labels = $labels;
    }

}
