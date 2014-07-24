<?php

require_once('../config.php');
require_once($SETTINGS['FRAMEWORK_ROOT'].'main.php');

$db = new dbCon();

$name = trim($db->real_escape_string($_POST["name"]));
$msg = trim($db->real_escape_string($_POST["msg"]));

$errorFields = array();
$i=0;

if(strlen($name) <= 0)
{
    $errorFields[] = '"name"';
}
if(strlen($msg) <= 0)
{
    $errorFields[] = '"msg"';
}


if(strlen($name)  <= 0 || strlen($msg)  <= 0)
{
    http_response_code(400);
    die('{"status" : "error", "errorFields" : ['.implode(",",$errorFields).']}');
}

if($_SERVER['REMOTE_USER'] != "visitor")
{
    $entries = $db->guestbook->storeEntry($name, $msg);
    die('{"name": "'.$name.'", "msg": "'.$msg.'","status":"success", "date": "'.date("H:i - d.m.y").'"}');
}
die('{"name": "ShabbY", "msg": "Visitors are not allowed to post in the guestbook.", "status":"error", "date": "'.date("H:i - d.m.y").'"}');

