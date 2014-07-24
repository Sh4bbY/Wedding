<?php

function time_elapsed($created,$short=false)
{
	try
	{
        $created = new DateTime($created);
        $now = new DateTime(date('Y-m-d H:i:s'));
        $created_diff = $now->diff($created);
	}
	catch(Exception $e)
	{
		return "";
	}

	if($created_diff->d > 3)
	{
		if($short)
		{
			return date_format($created, "d.m.Y");
		}
		return "am ".date_format($created, "d.m.Y")." um ".date_format($created, "H:i")." Uhr";
	}
	if($created_diff->d == 1)
	{
		if($short)
		{
			return "Gestern";
		}
		return "Gestern um ".date_format($created, "H:i")." Uhr";
	}
	if($created_diff->d > 0)
	{
		if($short)
		{
			return "vor ".$created_diff->d." Tagen";
		}
		return "vor ".$created_diff->d." Tagen um ".date_format($created, "H:i")." Uhr";
	}
	if($created_diff->h > 0)
	{
		return "vor ".$created_diff->h." Stunden";
	}
	if($created_diff->i == 1)
	{
		if($short)
		{
			return "vor 1 Minute";
		}
		return "vor einer Minute";
	}
	if($created_diff->i > 0)
	{
		if($short)
		{
			return "vor ".$created_diff->d." Minuten";
		}
		return "vor ".$created_diff->i." Minuten";
	}

	return "vor ".$created_diff->s." Sekunden";
}