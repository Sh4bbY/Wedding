com.shabbtech.global.namespace("com.shabbtech.wedding").main = com.shabbtech.global.namespace("com.shabbtech.wedding ").main || (function()
{
	"use strict";

	var body;
	var main;
	var pageChangeActive;
	var proxy;
	var audioPlayer;
	var audioContainer;
	var pages;
	var module;

	var Main = function ()
	{
		try
		{
			initialize.call(this);
		}
		catch(err)
		{
			console.error("Error @ Main initialization", err);
		}
	};

	var initialize = function ()
	{
		body	= jQuery("body");
		main	= body.find("#main");
		pages	= main.find("#pages");

		module = {};
		module.intro		= new com.shabbtech.wedding.intro();
		module.nav			= new com.shabbtech.wedding.navigation();
		module.gallery		= new com.shabbtech.wedding.gallery();
		module.guestbook	= new com.shabbtech.wedding.guestbook();
		module.upload		= new com.shabbtech.wedding.upload();

		proxy = {};
		proxy.onVideoThumbClick = jQuery.proxy(onVideoThumbClick, this);
		proxy.onWindowResize	= jQuery.proxy(onWindowResize,{"root":body.find("#root"),"nav": module.nav, "pages": pages});

		pageChangeActive = false;

		audioContainer		= body.find("#audio_container");
		audioPlayer			= audioContainer.find("#audio_player")[0];
		audioPlayer.volume	= 0.125;

		if(Modernizr.touch)
		{
			audioContainer.find(".play_pause").text("play");
			jQuery(".video_bg").remove();
		}
		else
		{
			audioPlayer.play();
		}

		main.height(jQuery(window).innerHeight());

		attachEventHandlers.call(this);

		module.intro.start();
	};

	var attachEventHandlers = function()
	{
		com.shabbtech.global.resize.setCheckInterval(250);
		com.shabbtech.global.resize.addFunction(proxy.onWindowResize, true, true);
		body.find("video").not(".background_video").on('play', onVideoClick);
		main.find(".video_list > li").click(proxy.onVideoThumbClick);
		audioContainer.find(".play_pause").click(onPlayPauseClick);
	};



	///////////////////////////////////////////////
	//
	//      Event Handler
	//


	var onPlayPauseClick = function()
	{
		if(audioPlayer.paused)
		{
			audioContainer.find(".play_pause").text("pause");
			audioPlayer.play();
		}
		else
		{
			audioContainer.find(".play_pause").text("play");
			audioPlayer.pause();
		}
	};

	var onVideoClick = function(e)
	{
		var vid = jQuery(e.currentTarget);

		if(!vid[0].paused && !audioPlayer.paused)
		{
			audioContainer.find(".play_pause").text("play");
			audioPlayer.pause();
		}
	};

	var onVideoThumbClick = function(e)
	{
		var jTarget = jQuery(e.currentTarget);
		var content = jTarget.parents(".content");
		var videoContainer = content.find(".video_container");
		var vid = videoContainer.find("video");
		var posterPath = jTarget.data("poster-path");
		var filePath = jTarget.data("file-path");

		content.find(".video_list > li").removeClass("active");
		jTarget.addClass("active");

		videoContainer.find(".info .size").text(jTarget.data("size"));
		videoContainer.find(".info .duration").text(jTarget.data("duration"));
		videoContainer.find(".info a").attr("href", filePath);
		videoContainer.find("h2").text(jTarget.find(".name").text());
		vid.attr("poster",posterPath);
		vid.find("source").attr("src",filePath);
		vid.load();
	};

	var onWindowResize = function ()
	{
		var activeWrapper = jQuery(".wrapper.active");
		var guestbook = jQuery("#guestbook.active");
		this.root.height(jQuery(window).innerHeight());
		this.root.css("overflow",((activeWrapper.length > 0 && body.height()<activeWrapper.height()+activeWrapper.offset().top)?"auto":"hidden") || (guestbook.length > 0 && body.height()<guestbook.outerHeight(true)+guestbook.offset().top?"auto":"hidden"));

		if(activeWrapper.length>0)
		{
			main.css("height", activeWrapper.height()+activeWrapper.offset().top);
		}
		else if(guestbook.length>0)
		{
			main.css("height", guestbook.outerHeight(true)+guestbook.offset().top);
		}

		var navFontSize = (body.width()*3.5)/1024;
		navFontSize = navFontSize>3.5?3.5:navFontSize;
		this.nav.Lvl1Wrapper.css("font-size",navFontSize+"em");
		body.find(".bg_title").css("font-size", navFontSize+"em");
		body.find(".bg_date").css("font-size", navFontSize/2+"em");
		body.find("#copyright").css("font-size", navFontSize/3+"em");

		var paddingTop = this.nav.Lvl1Wrapper.outerHeight(true) + this.nav.Lvl2Wrapper.outerHeight(true);
		this.pages.css("padding-top",paddingTop);
		var videoContainer = body.find(".video_container");
		var marginLeft = -videoContainer.find("video:visible").width()/2;
		body.find(".video_container.solo").find("h2, .info").filter(":visible").css("margin-left",marginLeft);

	};

	return Main;
}());


jQuery(window).load(function()
{
	var Main = new com.shabbtech.wedding.main();

	console.log("Welcome visiting this page, hope you enjoy and like it. Greetz ShabbY");
	console.info("Want to see the code ?  visit https://github.com/Sh4bbY/Wedding");
});