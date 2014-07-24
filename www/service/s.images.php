<?php

$path = "../assets/img/galleries/".$_POST['location']."/".$_POST['id']."/";
$thumbPath = $path."thumbs/";
$visitorImgPath = "/assets/img/visitor.jpg";

if ($handle = opendir($path))
{
    print '<ul class="image_list" data-id="'.$_POST["id"].'">';
    $files = array();

    while (false !== ($file = readdir($handle)))
    {
        if ($file != "." && $file != ".." && !is_dir($path.$file) && $file != "poster.jpg")
        {
            $files[] = $file;
        }
    }

    natsort($files);

    foreach($files as $file)
    {
        $item = '<li><a href="'.$path.$file.'" data-lightbox="gallery_'.$_POST['id'].'"><img src="'.$thumbPath.'thumb_'.$file.'"/></a></li>';

        if($_SERVER['REMOTE_USER'] == "visitor")
        {
            $item = '<li><a href="'.$visitorImgPath.'" data-lightbox="gallery_'.$_POST['id'].'"><img src="'.$thumbPath.'thumb_'.$file.'"/></a></li>';
        }

        print $item;
    }

    print '</ul>';
    closedir($handle);
}