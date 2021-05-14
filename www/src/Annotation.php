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

     /** @ORM\Column(type="string") */
     protected $description;

     /** @ORM\Column(type="string") */
     protected $color;

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

     public function getColor()
     {
         return $this->color;
     }

     public function setColor($color)
     {
         $this->color = $color;
     }
}
