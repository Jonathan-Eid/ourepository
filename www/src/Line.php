<?php
use Doctrine\ORM\Mapping as ORM;
/**
 * @ORM\Entity 
 * @ORM\Table(name="lines")
 */
class Line implements JsonSerializable
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
    protected $point1X;

    /** @ORM\Column(type="integer") */
    protected $point2X;

    /** @ORM\Column(type="integer") */
    protected $point1Y;

    /** @ORM\Column(type="integer") */
    protected $point2Y;

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

    public function getPoint1X()
     {
         return $this->point1X;
     }

     public function setPoint1X($point1X)
     {
         $this->point1X = $point1X;
     }

     public function getPoint1Y()
     {
         return $this->point1Y;
     }

     public function setPoint1Y($point1Y)
     {
         $this->point1Y = $point1Y;
     }

     public function getPoint2X()
     {
         return $this->point2X;
     }

     public function setPoint2X($point2X)
     {
         $this->point2X = $point2X;
     }

     public function getPoint2Y()
     {
         return $this->point2Y;
     }

     public function setPoint2Y($point2Y)
     {
         $this->point2Y = $point2Y;
     }

     public function jsonSerialize()
    {
        return array(
            'point1x' => $this->point1X,
            'point1y'=> $this->point1y,
            'point2x' => $this->point2x,
            'point2y' => $this->point2y
        );
    }

}

