  
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
     * @ORM\OneToMany(targetEntity="Project", mappedBy="organization", fetch="EAGER")
     */
    protected $projects;

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

    /** @ORM\OneToMany(targetEntity="Label", mappedBy="organization") */
    protected $labels;

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
    public function getVisible()
    {
        return $this->visible;
    }

    /**
     * @param mixed $visible
     */
    public function setVisible($visible)
    {
        $this->visible = $visible;
    }

    /**
     * @return mixed
     */
    public function getProjects()
    {
        return $this->projects;
    }

    /**
     * @param mixed $projects
     */
    public function setProjects($projects)
    {
        $this->projects = $projects;
    }

    /**
     * @return ArrayCollection
     */
    public function getOrgAcls(): ArrayCollection
    {
        return $this->orgAcls;
    }

    /**
     * @param ArrayCollection $orgAcls
     */
    public function setOrgAcls(ArrayCollection $orgAcls)
    {
        $this->orgAcls = $orgAcls;
    }

    /**
     * @return ArrayCollection
     */
    public function getMemberRoles(): ArrayCollection
    {
        return $this->memberRoles;
    }

    /**
     * @param ArrayCollection $memberRoles
     */
    public function setMemberRoles(ArrayCollection $memberRoles)
    {
        $this->memberRoles = $memberRoles;
    }

    /**
     * @return ArrayCollection
     */
    public function getRoles(): ArrayCollection
    {
        return $this->roles;
    }

    /**
     * @param ArrayCollection $roles
     */
    public function setRoles(ArrayCollection $roles)
    {
        $this->roles = $roles;
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

    /**
     * @return ArrayCollection
     */
    public function getLabels(): ArrayCollection
    {
        return $this->labels;
    }

    /**
     * @param ArrayCollection $labels
     */
    public function setLabels(ArrayCollection $labels)
    {
        $this->labels = $labels;
    }

    public function __construct() {
        $this->projects = new ArrayCollection();
        $this->orgAcls = new ArrayCollection();
        $this->memberRoles = new ArrayCollection();
        $this->roles = new ArrayCollection();
        $this->uuid = Uuid::uuid4()->toString();
        $this->labels = new ArrayCollection();
    }

    public function jsonSerialize() {
        return array(
            'uuid'=> $this->uuid,
            'name' => $this->name,
            'visible'=> $this->visible
        );
    }
}
