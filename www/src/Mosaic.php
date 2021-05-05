  
<?php

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;

/**
 * @ORM\Entity 
 * @ORM\Table(name="mosaics")
 */
class Mosaic implements JsonSerializable
{
    /** @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;

    /** @ORM\OneToMany(targetEntity="Rectangle", mappedBy="mosaic") */
    private $rectangles;

    /** @ORM\Column(type="string") */
    protected $filename;

    /** @ORM\Column(type="boolean") */
    protected $members;

    /** @ORM\Column(type="boolean") */
    protected $roles;

    /** @ORM\Column(type="integer") */
    protected $owner_id;

    /** @ORM\Column(type="string") */
    protected $identifier;

    /** @ORM\Column(type="integer") */
    protected $number_chunks;

    /** @ORM\Column(type="integer") */
    protected $uploaded_chunks;

    /** @ORM\Column(type="string", length=8096) */
    protected $chunk_status;

    /** @ORM\Column(type="string", length=32) */
    protected $md5_hash;

    /** @ORM\Column(type="bigint") */
    protected $size_bytes;

    /** @ORM\Column(type="bigint") */
    protected $bytes_uploaded;

    /** @ORM\Column(type="float") */
    protected $tiling_progress = 0;

    /** @ORM\Column(type="string", length=16) */
    protected $status;

    /** @ORM\Column(type="integer") */
    protected $height;

    /** @ORM\Column(type="integer") */
    protected $width;

    /** @ORM\Column(type="integer") */
    protected $channels;

    /** @ORM\Column(type="integer") */
    protected $geotiff;

    /** @ORM\Column(type="blob") */
    protected $coordinate_system;

    /** @ORM\Column(type="blob") */
    protected $metadata;

    /** @ORM\Column(type="blob") */
    protected $image_metadata;

    /** @ORM\Column(type="blob") */
    protected $bands;

    /** @ORM\Column(type="string", length=4, nullable=true) */
    protected $utm_zone;

    /** @ORM\Column(type="string", length=16, nullable=true) */
    protected $lat_upper_left;

    /** @ORM\Column(type="string", length=16, nullable=true) */
    protected $lon_upper_left;

    /** @ORM\Column(type="string", length=16, nullable=true) */
    protected $lat_upper_right;

    /** @ORM\Column(type="string", length=16, nullable=true) */
    protected $lon_upper_right;

    /** @ORM\Column(type="string", length=16, nullable=true) */
    protected $lat_lower_left;

    /** @ORM\Column(type="string", length=16, nullable=true) */
    protected $lon_lower_left;

    /** @ORM\Column(type="string", length=16, nullable=true) */
    protected $lat_lower_right;

    /** @ORM\Column(type="string", length=16, nullable=true) */
    protected $lon_lower_right;

    /** @ORM\Column(type="string", length=16, nullable=true) */
    protected $lat_center;

    /** @ORM\Column(type="string", length=16, nullable=true) */
    protected $lon_center;

    /** @ORM\Column(type="float", nullable=true) */
    protected $utm_e_upper_left;

    /** @ORM\Column(type="float", nullable=true) */
    protected $utm_n_upper_left;

    /** @ORM\Column(type="float", nullable=true) */
    protected $utm_e_upper_right;

    /** @ORM\Column(type="float", nullable=true) */
    protected $utm_n_upper_right;

    /** @ORM\Column(type="float", nullable=true) */
    protected $utm_e_lower_left;

    /** @ORM\Column(type="float", nullable=true) */
    protected $utm_n_lower_left;

    /** @ORM\Column(type="float", nullable=true) */
    protected $utm_e_lower_right;

    /** @ORM\Column(type="float", nullable=true) */
    protected $utm_n_lower_right;

    /** @ORM\Column(type="float", nullable=true) */
    protected $utm_e_center;

    /** @ORM\Column(type="float", nullable=true) */
    protected $utm_n_center;

    /**
     * @ORM\ManyToOne(targetEntity="Project")
     */
    protected $project;

    /**
     * @var \Ramsey\Uuid\UuidInterface
     * @ORM\Column(type="uuid", unique=true)
     */
    protected $uuid;

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getRectangles()
    {
        return $this->rectangles;
    }

    /**
     * @param mixed $rectangles
     */
    public function setRectangles($rectangles)
    {
        $this->rectangles = $rectangles;
    }

    public function getFilename()
    {
        return $this->filename;
    }

    public function setFilename($filename)
    {
        $this->filename = $filename;
    }

    public function getMembers()
    {
        return $this->members;
    }

    public function setMembers($members)
    {
        $this->members = $members;
    }

    public function getRoles()
    {
        return $this->roles;
    }

    public function setRoles($roles)
    {
        $this->roles = $roles;
    }

    public function getOwnerId()
    {
        return $this->owner_id;
    }

    public function setOwnerId($owner_id)
    {
        $this->owner_id = $owner_id;
    }

    public function getIdentifier()
    {
        return $this->identifier;
    }

    public function setIdentifier($identifier)
    {
        $this->identifier = $identifier;
    }

    public function getNumberChunks()
    {
        return $this->number_chunks;
    }

    public function setNumberChunks($number_chunks)
    {
        $this->number_chunks = $number_chunks;
    }

    public function getUploadedChunks()
    {
        return $this->uploaded_chunks;
    }

    public function setUploadedChunks($uploaded_chunks)
    {
        $this->uploaded_chunks = $uploaded_chunks;
    }

    public function getChunkStatus()
    {
        return $this->chunk_status;
    }

    public function setChunkStatus($chunk_status)
    {
        $this->chunk_status = $chunk_status;
    }

    public function getMd5Hash()
    {
        return $this->md5_hash;
    }

    public function setMd5Hash($md5_hash)
    {
        $this->md5_hash = $md5_hash;
    }

    public function getSizeBytes()
    {
        return $this->size_bytes;
    }

    public function setSizeBytes($size_bytes)
    {
        $this->size_bytes = $size_bytes;
    }

    public function getBytesUploaded()
    {
        return $this->bytes_uploaded;
    }

    public function setBytesUploaded($bytes_uploaded)
    {
        $this->bytes_uploaded = $bytes_uploaded;
    }

    public function getTilingProgress(): int
    {
        return $this->tiling_progress;
    }

    public function setTilingProgress(int $tiling_progress)
    {
        $this->tiling_progress = $tiling_progress;
    }

    public function getStatus()
    {
        return $this->status;
    }

    public function setStatus($status)
    {
        $this->status = $status;
    }

    public function getHeight()
    {
        return $this->height;
    }

    public function setHeight($height)
    {
        $this->height = $height;
    }

    public function getWidth()
    {
        return $this->width;
    }

    public function setWidth($width)
    {
        $this->width = $width;
    }

    public function getChannels()
    {
        return $this->channels;
    }

    public function setChannels($channels)
    {
        $this->channels = $channels;
    }

    public function getGeotiff()
    {
        return $this->geotiff;
    }

    public function setGeotiff($geotiff)
    {
        $this->geotiff = $geotiff;
    }

    public function getCoordinateSystem()
    {
        return $this->coordinate_system;
    }

    public function setCoordinateSystem($coordinate_system)
    {
        $this->coordinate_system = $coordinate_system;
    }

    public function getMetadata()
    {
        return $this->metadata;
    }

    public function setMetadata($metadata)
    {
        $this->metadata = $metadata;
    }

    public function getImageMetadata()
    {
        return $this->image_metadata;
    }

    public function setImageMetadata($image_metadata)
    {
        $this->image_metadata = $image_metadata;
    }

    public function getBands()
    {
        return $this->bands;
    }

    public function setBands($bands)
    {
        $this->bands = $bands;
    }

    public function getUtmZone()
    {
        return $this->utm_zone;
    }

    public function setUtmZone($utm_zone)
    {
        $this->utm_zone = $utm_zone;
    }

    public function getLatUpperLeft()
    {
        return $this->lat_upper_left;
    }

    public function setLatUpperLeft($lat_upper_left)
    {
        $this->lat_upper_left = $lat_upper_left;
    }

    public function getLonUpperLeft()
    {
        return $this->lon_upper_left;
    }

    public function setLonUpperLeft($lon_upper_left)
    {
        $this->lon_upper_left = $lon_upper_left;
    }

    public function getLatUpperRight()
    {
        return $this->lat_upper_right;
    }

    public function setLatUpperRight($lat_upper_right)
    {
        $this->lat_upper_right = $lat_upper_right;
    }

    public function getLonUpperRight()
    {
        return $this->lon_upper_right;
    }

    public function setLonUpperRight($lon_upper_right)
    {
        $this->lon_upper_right = $lon_upper_right;
    }

    public function getLatLowerLeft()
    {
        return $this->lat_lower_left;
    }

    public function setLatLowerLeft($lat_lower_left)
    {
        $this->lat_lower_left = $lat_lower_left;
    }

    public function getLonLowerLeft()
    {
        return $this->lon_lower_left;
    }

    public function setLonLowerLeft($lon_lower_left)
    {
        $this->lon_lower_left = $lon_lower_left;
    }

    public function getLatLowerRight()
    {
        return $this->lat_lower_right;
    }

    public function setLatLowerRight($lat_lower_right)
    {
        $this->lat_lower_right = $lat_lower_right;
    }

    public function getLonLowerRight()
    {
        return $this->lon_lower_right;
    }

    public function setLonLowerRight($lon_lower_right)
    {
        $this->lon_lower_right = $lon_lower_right;
    }

    public function getLatCenter()
    {
        return $this->lat_center;
    }

    public function setLatCenter($lat_center)
    {
        $this->lat_center = $lat_center;
    }

    public function getLonCenter()
    {
        return $this->lon_center;
    }

    public function setLonCenter($lon_center)
    {
        $this->lon_center = $lon_center;
    }

    public function getUtmEUpperLeft()
    {
        return $this->utm_e_upper_left;
    }

    public function setUtmEUpperLeft($utm_e_upper_left)
    {
        $this->utm_e_upper_left = $utm_e_upper_left;
    }

    public function getUtmNUpperLeft()
    {
        return $this->utm_n_upper_left;
    }

    public function setUtmNUpperLeft($utm_n_upper_left)
    {
        $this->utm_n_upper_left = $utm_n_upper_left;
    }

    public function getUtmEUpperRight()
    {
        return $this->utm_e_upper_right;
    }

    public function setUtmEUpperRight($utm_e_upper_right)
    {
        $this->utm_e_upper_right = $utm_e_upper_right;
    }

    public function getUtmNUpperRight()
    {
        return $this->utm_n_upper_right;
    }

    public function setUtmNUpperRight($utm_n_upper_right)
    {
        $this->utm_n_upper_right = $utm_n_upper_right;
    }

    public function getUtmELowerLeft()
    {
        return $this->utm_e_lower_left;
    }

    public function setUtmELowerLeft($utm_e_lower_left)
    {
        $this->utm_e_lower_left = $utm_e_lower_left;
    }

    public function getUtmNLowerLeft()
    {
        return $this->utm_n_lower_left;
    }

    public function setUtmNLowerLeft($utm_n_lower_left)
    {
        $this->utm_n_lower_left = $utm_n_lower_left;
    }

    public function getUtmELowerRight()
    {
        return $this->utm_e_lower_right;
    }

    public function setUtmELowerRight($utm_e_lower_right)
    {
        $this->utm_e_lower_right = $utm_e_lower_right;
    }

    public function getUtmNLowerRight()
    {
        return $this->utm_n_lower_right;
    }

    public function setUtmNLowerRight($utm_n_lower_right)
    {
        $this->utm_n_lower_right = $utm_n_lower_right;
    }

    public function getUtmECenter()
    {
        return $this->utm_e_center;
    }

    public function setUtmECenter($utm_e_center)
    {
        $this->utm_e_center = $utm_e_center;
    }

    public function getUtmNCenter()
    {
        return $this->utm_n_center;
    }

    public function setUtmNCenter($utm_n_center)
    {
        $this->utm_n_center = $utm_n_center;
    }

    public function getProject()
    {
        return $this->project;
    }

    public function setProject($project)
    {
        $this->project = $project;
    }

    public function getUuid()
    {
        return $this->uuid;
    }

    public function setUuid($uuid)
    {
        $this->uuid = $uuid;
    }

    public function __construct() {
        $this->uuid = Uuid::uuid4()->toString();
        $this->rectangles = new ArrayCollection();
    }

    public function jsonSerialize()
    {
        return array(
            'uuid'=> $this->uuid,
            'name' => $this->identifier,
        );
    }
}
