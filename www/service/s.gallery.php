<?php

require_once('../config.php');
require_once($SETTINGS['FRAMEWORK_ROOT'].'main.php');

$db = new dbCon();
$entries = $db->gallery->getEntries();

for($i=0;$i<sizeof($entries);$i++)
{
    $name = $entries[$i]["name"];
    $gallery_id = $entries[$i]["galleries_id"];
    $gallery_location = $entries[$i]["location"];
    $path = "assets/img/galleries/".$gallery_location."/".$gallery_id."/";

    print '<li class="gallery" data-id="'.$gallery_id.'" data-location="'.$gallery_location.'">';
    print '<div class="overlay"></div><div class="owner">von <span class="name">'.$name.'</span></div><img class="active" src="'.$path.'poster.jpg" />';
    print '</li>';
}