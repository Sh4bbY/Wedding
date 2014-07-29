<?php
header('X-UA-Compatible: IE=edge,chrome=1');
require_once('config.php');
require_once($SETTINGS['FRAMEWORK_ROOT'].'main.php');

init();

?>

<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <!--meta http-equiv="X-UA-Compatible" content="IE=edge"-->
        <title>Hochzeit von Sandra & Christian</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
		<link rel="stylesheet" href="css/style.css" />
        <script src="../js/modernizr-2.6.2.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 7]>
		<p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <div id="no_js_screen">Um diese Seite besuchen zu können, musst du <span style="text-decoration: underline">JavaScript aktivieren</span>.</div>
		<script>
			document.getElementById("no_js_screen").style.display = 'none';
		</script>

        <div id="root">
            <div id="intro">
                <div class="txt">
                    <span class="title">Sandra <span class="ampersand">&</span> Christian</span><br/>
                    <span class="subtitle">Hochzeit in Südtirol</span>
                </div>
				<div class="skip"><a href="#home">skip</a></div>
            </div>
            <div class="video_bg">
                <video width="1200" class="background_video" muted>
                    <source src="assets/video/video_bg.mp4" type="video/mp4"/>
                </video>
                <div class="overlay">
                </div>
            </div>
            <div id="logo">
                <img class="mountains" src="assets/img/mountains.svg" alt="mountains">
                <img class="bird green" src="assets/img/bird_green.png" alt="bird_green">
                <img class="bird yellow" src="assets/img/bird_yellow.png" alt="bird_yellow">
            </div>
			<div id="main">
                <?php
                    include("navigation.php");
                ?>
                <div id="pages">
                    <?php
                        include("page/videos.php");
                        include("page/galleries.php");
                        include("page/guestbook.php");
                        include("page/upload.php");
                    ?>
                </div>
			</div>
            <div id="copyright">created by <a href="http://www.ShabbTech.com" target="_blank">ShabbTech.com</a></div>
            <div id="audio_container">
                <a href="#" class="play_pause">pause</a>
                <audio id="audio_player">
                    <source src="/assets/sound/music.mp3" type="audio/mpeg" />
                    Ihre Browser hat keine Unterstützung für dieses Audio-Format.
                </audio>
            </div>
        </div>

        <script src="/js/global.min.js"></script>
        <script src="js/wedding.min.js"></script>

    </body>
</html>


<?php

function init()
{

//open db connection
    global $db;
    $db = new dbCon();

    global $page;

    $page = "login";

    if(isset($_GET['page']))
    {
        $page = $_GET['page'];
    }
}
?>