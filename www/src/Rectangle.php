<?php
use Doctrine\ORM\Mapping as ORM;
/**
 * @ORM\Entity 
 * @ORM\Table(name="rectangles")
 */
class Rectangle implements JsonSerializable
{

    /** @ORM\Id 
     * @ORM\Column(type="integer") 
     * @ORM\GeneratedValue */
    protected $id;

//    /** @ORM\Column(type="integer") */
//    protected $owner_id;

    /** @ORM\ManyToOne(targetEntity="Label") */
    protected $label;

    /** @ORM\ManyToOne(targetEntity="Mosaic", inversedBy="rectangles") */
    protected $mosaic;

//    /** @ORM\Column(type="integer") */
//    protected $annotation_id;

    /** @ORM\Column(type="float") */
    protected $x1;

    /** @ORM\Column(type="float") */
    protected $x2;

    /** @ORM\Column(type="float") */
    protected $y1;

    /** @ORM\Column(type="float") */
    protected $y2;

    public function getId()
    {
        return $this->id;
    }

//    public function getOwner()
//    {
//        return $this->owner_id;
//    }
//
//    public function setOwner($owner_id)
//    {
//        $this->owner_id = $owner_id;
//    }

    public function getMosaic()
    {
        return $this->mosaic;
    }

    public function setMosaic($mosaic)
    {
        $this->mosaic = $mosaic;
    }

//    public function getAnnotation()
//    {
//        return $this->annotation_id;
//    }
//
//    public function setAnnotation($annotation_id)
//    {
//        $this->annotation_id = $annotation_id;
//    }

    public function getX1()
     {
         return $this->x1;
     }

     public function setX1($x1)
     {
         $this->x1 = $x1;
     }

     public function getY1()
     {
         return $this->y1;
     }

     public function setY1($y1)
     {
         $this->y1 = $y1;
     }

     public function getX2()
     {
         return $this->x2;
     }

     public function setX2($x2)
     {
         $this->x2 = $x2;
     }

     public function getY2()
     {
         return $this->y2;
     }

     public function setY2($y2)
     {
         $this->y2 = $y2;
     }

     public function jsonSerialize()
    {
        return array(
            'point1x' => $this->x1,
            'point1y'=> $this->y1,
            'point2x' => $this->x2,
            'point2y' => $this->y2
        );
    }


}

