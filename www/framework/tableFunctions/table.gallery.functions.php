<?php
/**
 * Created by IntelliJ IDEA.
 * User: ShabbY
 * Date: 16.04.13
 * Time: 23:45
 * To change this template use File | Settings | File Templates.
 */


class GalleryTableFunctions
{
    public $GALLERY_DIR = "assets/img/galleries/standesamt/";

	public function __construct($db)
	{
		$this->db = $db;
		$this->con = $db->getConnection();
	}


	public function getEntries()
	{
		$query = "SELECT * FROM `galleries` ORDER BY galleries_id ASC";
		$result = $this->db->query_rows($query);

		return $result;
	}

    public function insertEntry($name,$location)
    {
        $query = "INSERT INTO `galleries` (`name`, `location`) VALUES ('".$name."','".$location."')";
        $result = $this->db->query($query);

        return $result;
    }
}