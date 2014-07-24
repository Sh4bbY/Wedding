<?php

$path = "../assets/img/galleries/".$_POST['location']."/".$_POST['id']."/";
$thumbPath = $path."thumbs/";

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
        print '<li><a href="'.$path.$file.'" data-lightbox="gallery_'.$_POST['id'].'"><img src="'.$thumbPath.'thumb_'.$file.'"/></a></li>';
    }

    print '</ul>';
    closedir($handle);
}