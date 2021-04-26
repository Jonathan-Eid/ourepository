  
<?php
use Doctrine\ORM\Mapping as ORM;
/**
 * @ORM\Entity 
 * @ORM\Table(name="Mosaics")
 */
class Mosaic
{
    /** @ORM\Id 
    * @ORM\Column(type="integer") 
     * @ORM\GeneratedValue */
    protected $id;

    /** @ORM\Column(type="string") */
    protected $filename;

    /** @ORM\Column(type="boolean") */
    protected $visible;

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

    /** @ORM\Column(type="string") */
    protected $md5_hash;

    /** @ORM\Column(type="bigint") */
    protected $size_bytes;

    /** @ORM\Column(type="bigint") */
    protected $bytes_uploaded;

    /** @ORM\Column(type="integer") */
    protected $tiling_progress;
    
    /** @ORM\Column(type="string") */
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

    /**
     * @ORM\ManyToOne(targetEntity="Project")
     */
    protected $project;

    public function getId()
    {
        return $this->id;
    }

    public function getFilename()
    {
        return $this->filename;
    }
    
    public function setFilename($filename)
    {
        $this->filename = $filename;
    }

    public function getVisible()
    {
        return $this->visible;
    }

    public function setVisible($visible)
    {
        $this->visible = $visible;
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

    public function getProject()
    {
        return $this->project;
    }

    public function setProject($project)
    {
        $this->project = $project;
    }

    public function setNumberChunks($number_chunks){
        $this->number_chunks = $number_chunks;
    }

    public function setUploadedChunks($chunks){
        $this->uploaded_chunks = $chunks;
    }

    public function setIdentifier($identifier){
        $this->identifier = $identifier;
    }

    public function setOwner($owner_id){
        $this->owner_id = $owner_id;
    }

    public function setChunkStatus($status){
        $this->chunk_status= $status;
    }

    public function setSizeBytes($size){
        $this->size_bytes = $size;
    }

    public function setUploadedBytes($uploaded){
        $this->bytes_uploaded = $uploaded;
    }

    public function setHash($hash){
        $this->md5_hash = $hash;
    }

    public function setTilingProgress($tiling_progress){
        $this->tiling_progress = $tiling_progress;
    }

    public function setStatus($status){
        $this->status = $status;
    }

    public function setHeight($height){
        $this->height = $height;
    }

    public function setWidth($width){
        $this->width = $width;
    }

    public function setChannels($channels){
        $this->channels = $channels;
    }

    public function setGeotiff($geotiff){
        $this->geotiff = $geotiff;
    }

    public function setCoordinateSystem($system){
        $this->coordinate_system = $system;
    }

    public function setMetadata($metadata){
        $this->metadata = $metadata;
    }

    public function setImageMetadata($image_metadata){
        $this->image_metadata = $image_metadata;
    }

    public function setBands($bands){
        $this->bands = $bands;
    }
}
