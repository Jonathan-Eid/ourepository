<?php
use Doctrine\ORM\Mapping as ORM;
/**
 * @ORM\Entity
 * @ORM\Table(name="annotations")
 */
class Annotation
{

    /** @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue */
     protected $id;

     /** @ORM\Column(type="integer") */
     protected $mosaicId;

     /** @ORM\Column(type="string") */
     protected $name;

     /** @ORM\Column(type="string") */
     protected $annotations;

     /** @ORM\Column(type="string") */
     protected $type;

     /** @ORM\Column(type="integer") */
     protected $point1X;

     /** @ORM\Column(type="integer") */
     protected $point2X;

     /** @ORM\Column(type="integer") */
     protected $point1Y;

     /** @ORM\Column(type="integer") */
     protected $point2Y;

     /** @ORM\Column(type="string") */
     protected $description;

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

     public function getDescription()
     {
         return $this->description;
     }

     public function setDescription($description)
     {
         $this->description = $description;
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
}
