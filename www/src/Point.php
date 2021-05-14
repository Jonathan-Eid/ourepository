<?php
use Doctrine\ORM\Mapping as ORM;
/**
 * @ORM\Entity 
 * @ORM\Table(name="points")
 */
class Point implements JsonSerializable
{

    /** @ORM\Id 
     * @ORM\Column(type="integer") 
     * @ORM\GeneratedValue */
    protected $id;

    /** @ORM\Column(type="integer") */
    protected $owner_id;

    /** @ORM\Column(type="integer") */
    protected $mosaic_id;

    /** @ORM\Column(type="integer") */
    protected $annotation_id;

    /** @ORM\Column(type="integer") */
    protected $cx;

    /** @ORM\Column(type="integer") */
    protected $cy;

    /** @ORM\Column(type="integer") */
    protected $radius;

    public function getId()
    {
        return $this->id;
    }

    public function getOWner()
    {
        return $this->owner_id;
    }

    public function setOwner($owner_id)
    {
        $this->owner_id = $owner_id;
    }

    public function getMosaic()
    {
        return $this->mosaic_id;
    }

    public function setMosaic($mosaic_id)
    {
        $this->mosaic_id = $mosaic_id;
    }

    public function getAnnotation()
    {
        return $this->annotation_id;
    }

    public function setAnnotation($annotation_id)
    {
        $this->annotation_id = $annotation_id;
    }

    public function getCX()
    {
        return $this->cx;
    }

    public function setCX($cx)
    {
        $this->cx = $cx;
    }

    public function getCY()
    {
        return $this->cy;
    }

    public function setCY($cy)
    {
        $this->cy = $cy;
    }

    public function getRadius()
    {
        return $this->radius;
    }

    public function setRadius($radius)
    {
        $this->radius = $radius;
    }

    public function jsonSerialize()
    {
        return array(
            'cx' => $this->cx,
            'cy'=> $this->cy,
            'radius' => $this->radius
        );
    }

}