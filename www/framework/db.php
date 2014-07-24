<?php
/**
 * Created by IntelliJ IDEA.
 * User: ShabbY
 * Date: 01.04.13
 * Time: 18:27
 * To change this template use File | Settings | File Templates.
 */

require_once($SETTINGS['FRAMEWORK_ROOT'].'/tableFunctions/table.guestbook.functions.php');
require_once($SETTINGS['FRAMEWORK_ROOT'].'/tableFunctions/table.gallery.functions.php');

class dbCon
{
	private $con = null;

	public function __construct()
	{
		global $SETTINGS;

		$this->mysql_host 		= $SETTINGS['mysql_host'];
		$this->mysql_user 		= $SETTINGS['mysql_user'];
		$this->mysql_password 	= $SETTINGS['mysql_pw'];
		$this->mysql_db 		= $SETTINGS['mysql_db'];

		$this->connect($this->mysql_host, $this->mysql_user, $this->mysql_password, $this->mysql_db);

        $this->guestbook	= new GuestbookTableFunctions($this);
        $this->gallery	    = new GalleryTableFunctions($this);
	}


	public function connect($host, $user, $password, $db)
	{
		global $lang;

		$this->con =  new mysqli($host, $user, $password, $db);

		if($this->con->connect_errno > 0)
		{
			die($lang['db']['connection_error'].' [' . $this->con->connect_error . ']');
		}
	}

	public function query($query)
	{
		$this->doQuery($query);

		//$qResult = mysqli_use_result($this->con);

		return true;
	}

	public function query_row($query,$mode="assoc")
	{
		$query_result = $this->doQuery($query);

		if($query_result->num_rows <= 0)
		{
			$result = false;
		}
		else
		{
			switch($mode)
			{
				case "array":	$result = $query_result->fetch_array(); break;
				case "assoc":
				default:		$result = $query_result->fetch_assoc();
			}
		}

		return $result;
	}

	public function query_rows($query,$mode="assoc")
	{
		$query_result = $this->doQuery($query);
		$result = null;

		switch($mode)
		{
			case "array":	$result = $query_result->fetch_all();
							break;
			case "assoc":
			default:		while($row = $query_result->fetch_assoc())
							{
								$result[] = $row;
							}
							break;
		}

		return $result;
	}

	public function call($queryStmt)
	{
		global $lang;
		$returnVal = true;

		$query = $this->con->multi_query($queryStmt);

		if(!$query)
		{
			die($lang['db']['query_error'].' ['.$this->con->error.']');
		}

		$result = $this->con->use_result();
		if($result != false)
		{
			$returnVal = $result->fetch_assoc();
			$result->free();
		}

		while($this->con->more_results() && $this->con->next_result())
		{
			$result = $this->con->use_result();
			if($result instanceof mysqli_result)
			{
				$result->free();
			}
		}

		return $returnVal;
	}

	private function doQuery($query)
	{
		global $lang;

		$query_result = $this->con->query($query);

		if(!$query_result)
		{
			die($lang['db']['query_error'].' ['.$this->con->error.']');
		}

		return $query_result;
	}

	public function close()
	{
		$this->con->close();
	}

	public function real_escape_string($str)
	{
		return $this->con->real_escape_string($str);
	}

	public function getConnection()
	{
		return $this->con;
	}
}
