<?php
/**
 * Created by IntelliJ IDEA.
 * User: ShabbY
 * Date: 16.04.13
 * Time: 23:45
 * To change this template use File | Settings | File Templates.
 */


class GuestbookTableFunctions
{
	public function __construct($db)
	{
		$this->db = $db;
		$this->con = $db->getConnection();
	}


    public function getEntries()
    {
        $query = "SELECT * FROM `guestbook` ORDER BY guestbook_id DESC";
        $result = $this->db->query_rows($query);

        return $result;
    }

    public function storeEntry($name,$msg)
    {
        $query = "INSERT INTO `guestbook` (`name`,`entry`) VALUES ('".$name."','".$msg."')";
        $result = $this->db->query($query);

        return $result;
    }
}