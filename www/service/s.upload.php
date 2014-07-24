<?php

require_once('../config.php');
require_once($SETTINGS['FRAMEWORK_ROOT'].'main.php');

$db = new dbCon();

$username   = $db->real_escape_string($_POST["name"]);
$poster     = $db->real_escape_string($_POST["poster"]);
$location   = $db->real_escape_string($_POST["location"]);
$amount     = $db->real_escape_string($_POST["amount"]);
$index      = $db->real_escape_string($_POST["index"]);

$entries    = $db->gallery->getEntries();
$allowed    = array('png', 'jpg', 'gif','zip');

if(isset($_FILES['upl']) && $_FILES['upl']['error'] == 0)
{
    $isNew = true;
    $entries = $db->gallery->getEntries();
    $newId = 0;

    for($i=0;$i<sizeof($entries);$i++)
    {
        if($username == $entries[$i]["name"] && $location == $entries[$i]["location"])
        {
            $isNew = false;
            $gallery_id = $entries[$i]["galleries_id"];
        }
        $newId = max($newId, $entries[$i]["galleries_id"]);
    }
    if($isNew)
    {
        $gallery_id = $newId+1;
        $db->gallery->insertEntry($username,$location);
    }

    $galleryPath = "../assets/img/galleries/".$location."/".$gallery_id."/";
    $thumbPath = $galleryPath."thumbs/";

    if(!is_dir($galleryPath))
    {
        mkdir($galleryPath);
    }
    if(!is_dir($thumbPath))
    {
        mkdir($thumbPath);
    }

    $filename = $_FILES['upl']['name'];
    $destination = $galleryPath.$filename;
    $extension = pathinfo($filename, PATHINFO_EXTENSION);

    if(!in_array(strtolower($extension), $allowed))
    {
        echo '{"status":"error"}';
        exit;
    }

    if(move_uploaded_file($_FILES['upl']['tmp_name'], $destination))
    {
        createThumb($destination, $thumbPath, "thumb_".$filename ,150, 150);

        if($poster == $filename)
        {
            createThumb($destination, $galleryPath, "poster.jpg" ,270, 150);
        }
        resizeImg($destination, 1600, 1200);
        $finish = "";
        $fileAmount = 0;

        if ($handle = opendir($thumbPath))
        {
            while (false !== ($file = readdir($handle)))
            {
                if ($file != "." && $file != ".." && !is_dir($thumbPath.$file))
                {
                    $fileAmount++;
                }
            }
            closedir($handle);
        }

        echo '{"status":"success", "index":'.$index.'}';

        exit;
    }
}

function resizeImg($src, $newWidth, $newHeight)
{
    list($width, $height) = getimagesize($src);

    $img = imagecreatefromjpeg($src);

    if ($width<$height)
    {
        $newWidth = $newHeight*$width/$height;
    }
    else
    {
        $newHeight = $newWidth*$height/$width;
    }

    $tmpImg = imagecreatetruecolor($newWidth, $newHeight);
    imagecopyresized($tmpImg,$img,0,0,0,0,$newWidth,$newHeight,$width,$height);
    imagejpeg($tmpImg, $src, 90);
}

function createThumb($src, $thumbPath, $name, $thumbWidth, $thumbHeight)
{
    list($width, $height) = getimagesize($src);

    $thumb = imagecreatefromjpeg($src);

    if ($width>=$height)
    {
        $neu_h = ($thumbHeight);
        $neu_br = ($thumbHeight*$width/$height);
        $pos_br = ($neu_br-$thumbWidth)/2;
        $pos_h = 0;
    }
    else
    {
        $neu_br = ($thumbWidth);
        $neu_h = ($thumbWidth*$height/$width);
        $pos_br = 0;
        $pos_h = ($neu_h-$thumbHeight)/2;
    }

    $tmpThumb = imagecreatetruecolor($neu_br, $neu_h);

    imagecopyresampled($tmpThumb, $thumb, 0,0,0,0, $neu_br, $neu_h, $width, $height);

    $createdThumb = imagecreatetruecolor($thumbWidth, $thumbHeight);
    imagecopy($createdThumb, $tmpThumb, 0,0,$pos_br,$pos_h,$thumbWidth,$thumbHeight);

    $thumbDest = $thumbPath.$name;

    imagejpeg($createdThumb, $thumbDest, 90);
}

die('{"status":"error"}');