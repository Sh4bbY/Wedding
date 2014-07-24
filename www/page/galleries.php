<div id="galleries" class="category_content" data-order="0">
    <div class="wrapper">
        <div class="bg_color"></div>
        <span class="bg_title">Polterabend</span>
        <span class="bg_date">28.06.2014</span>
        <div class="content">
            <div class="upload_indicator">
                <img src="/assets/img/img_upload.png" alt="Bilder Hochladen"/>
                <a href="#">eigene Bilder hochladen</a>
            </div>
            <ul class="gallery_list" data-location="polterabend">
                <?php

                global $gallery_id;
                $entries = $db->gallery->getEntries();
                $count = 0;

                for($i=0;$i<sizeof($entries);$i++)
                {
                    if($entries[$i]["location"] != "polterabend")
                    {
                        continue;
                    }

                    $count++;
                    $name = $entries[$i]["name"];
                    $gallery_id = $entries[$i]["galleries_id"];
                    $path = "assets/img/galleries/polterabend/".$gallery_id."/";

                    print '<li class="gallery" data-id="'.$gallery_id.'">';
                    print '<div class="overlay"></div><div class="owner">von <span class="name">'.$name.'</span></div><img class="active" src="'.$path.'poster.jpg" />';
                    print '</li>';
                }
                ?>
            </ul>
            <div class="images" data-location="polterabend">
                <div class="back">
                    <a href="#">Zurück</a>
                </div>
                <div class="imageContainer">
                </div>
            </div>
            <?php
            if($count == 0)
            {
                print '<div class="coming_soon">coming soon...</div>';
            }
            ?>
        </div>
    </div>
    <div class="wrapper">
        <div class="bg_color"></div>
        <span class="bg_title">Standesamt</span>
        <span class="bg_date">01.07.2014</span>
        <div class="content">
            <div class="upload_indicator">
                <img src="/assets/img/img_upload.png" alt="Bilder Hochladen"/>
                <a href="#">eigene Bilder hochladen</a>
            </div>
            <ul class="gallery_list" data-location="standesamt">
                <?php

                global $gallery_id;
                $entries = $db->gallery->getEntries();
                $count=0;

                for($i=0;$i<sizeof($entries);$i++)
                {
                    if($entries[$i]["location"] != "standesamt")
                    {
                        continue;
                    }

                    $count++;
                    $name = $entries[$i]["name"];
                    $gallery_id = $entries[$i]["galleries_id"];
                    $path = "assets/img/galleries/standesamt/".$gallery_id."/";

                    print '<li class="gallery" data-id="'.$gallery_id.'">';
                    print '<div class="overlay"></div><div class="owner">von <span class="name">'.$name.'</span></div><img class="active" src="'.$path.'poster.jpg" />';
                    print '</li>';
                }
                ?>
            </ul>
            <div class="images" data-location="standesamt">
                <div class="back">
                    <a href="#">Zurück</a>
                </div>
                <div class="imageContainer">
                </div>
            </div>
            <?php
            if($count == 0)
            {
                print '<div class="coming_soon">coming soon...</div>';
            }
            ?>
        </div>
    </div>
    <div class="wrapper">
        <div class="bg_color"></div>
        <span class="bg_title">Hochzeit</span>
        <span class="bg_date">05.07.2014</span>
        <div class="content">
            <div class="upload_indicator">
                <img src="/assets/img/img_upload.png" alt="Bilder Hochladen"/>
                <a href="#">eigene Bilder hochladen</a>
            </div>
            <ul class="gallery_list" data-location="hochzeit">
                <?php

                global $gallery_id;
                $entries = $db->gallery->getEntries();
                $count=0;

                for($i=0;$i<sizeof($entries);$i++)
                {
                    if($entries[$i]["location"] != "hochzeit")
                    {
                        continue;
                    }

                    $count++;
                    $name = $entries[$i]["name"];
                    $gallery_id = $entries[$i]["galleries_id"];
                    $path = "assets/img/galleries/hochzeit/".$gallery_id."/";

                    print '<li class="gallery" data-id="'.$gallery_id.'">';
                    print '<div class="overlay"></div><div class="owner">von <span class="name">'.$name.'</span></div><img class="active" src="'.$path.'poster.jpg" alt="von '.$name.'"/>';
                    print '</li>';
                }
                ?>
            </ul>
            <div class="images" data-location="hochzeit">
                <div class="back">
                    <a href="#">Zurück</a>
                </div>
                <div class="imageContainer">
                </div>
            </div>
            <?php
            if($count == 0)
            {
                print '<div class="coming_soon">coming soon...</div>';
            }
            ?>
        </div>
    </div>
    <div class="wrapper">
        <div class="bg_color"></div>
        <span class="bg_title">Rund um die Hochzeit</span>
        <span class="bg_date">ab dem 03.07.2014</span>
        <div class="content">
            <div class="upload_indicator">
                <img src="/assets/img/img_upload.png" alt="Bilder Hochladen"/>
                <a href="#">eigene Bilder hochladen</a>
            </div>
            <ul class="gallery_list" data-location="diverses">
                <?php

                global $gallery_id;
                $entries = $db->gallery->getEntries();
                $count=0;

                for($i=0;$i<sizeof($entries);$i++)
                {
                    if($entries[$i]["location"] != "diverses")
                    {
                        continue;
                    }

                    $count++;
                    $name = $entries[$i]["name"];
                    $gallery_id = $entries[$i]["galleries_id"];
                    $path = "assets/img/galleries/diverses/".$gallery_id."/";

                    print '<li class="gallery" data-id="'.$gallery_id.'">';
                    print '<div class="overlay"></div><div class="owner">von <span class="name">'.$name.'</span></div><img class="active" src="'.$path.'poster.jpg" alt="von '.$name.'"/>';
                    print '</li>';
                }
                ?>
            </ul>
            <div class="images" data-location="diverses">
                <div class="back">
                    <a href="#">Zurück</a>
                </div>
                <div class="imageContainer">
                </div>
            </div>
            <?php
            if($count == 0)
            {
                print '<div class="coming_soon">coming soon...</div>';
            }
            ?>
        </div>
    </div>
</div>