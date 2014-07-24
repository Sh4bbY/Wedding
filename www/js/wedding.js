/*
Wedding v 0.1.0 - 24.07.2014 
Copyright (c) 2014 
ShabbTech
*/

com.shabbtech.global.namespace("com.shabbtech.wedding").gallery = com.shabbtech.global.namespace("com.shabbtech.wedding").gallery || (function()
{
	"use strict";

	var galleryList;
	var imageContainer;
	var main;
	var proxy;
	var jUpload;

	var Gallery = function ()
	{
		try
		{
			initialize.call(this);
		}
		catch(err)
		{
			console.error("Error on Gallery Initialization", err);
		}
	};

	var initialize = function ()
	{
		main	= jQuery("#main");
		jUpload = main.find("#upload");

		proxy = {};
		proxy.onUploadExitComplete = jQuery.proxy(onUploadExitComplete, this);

		main.find(".gallery_list > li").click(onGalleryClick);
		main.find(".images .back a").click(onImageBackClick);

		main.find(".upload_indicator").click(onUploadIndicatorClick);
		main.find("#upload .exit").click(onUploadExitClick);
	};


	//////////////////////////////////
	//
	//		Event Handler

	//-------------------------------  Click Handler

	var onImageBackClick = function (e)
	{
		e.preventDefault();

		imageContainer = jQuery(e.currentTarget).parents(".images");
		galleryList = imageContainer.siblings(".gallery_list");
		imageContainer.fadeOut({"duration": 500, "easing": "easeInQuart", "complete": onImageFadeOutComplete});
	};

	var onGalleryClick = function (e)
	{
		var jTarget = jQuery(e.currentTarget);
		galleryList = jTarget.parents(".gallery_list");
		imageContainer = galleryList.siblings(".images");
		galleryList.fadeOut({"duration": 500, "easing": "easeInQuart", "complete": onGalleryFadeOutComplete});

		var gallery = imageContainer.find("ul.image_list[data-id="+jTarget.data("id")+"]");
		if(gallery.length === 0)
		{
			jQuery.ajax("/service/s.images.php",{
				type: "POST",
				data:{"id":jTarget.data("id"),"location": imageContainer.data("location")},
				complete: function(e)
				{
					imageContainer.append(e.responseText);
				}
			});
		}
		else
		{
			setTimeout(function() {
				gallery.show();
				imageContainer.fadeIn();
			},500);
		}
	};

	var onUploadIndicatorClick = function(e)
	{
		var location = jQuery(e.currentTarget).parents(".content").find(".gallery_list").data('location');
		jUpload.find("select[name=location] option[value="+location+"]").prop('selected', true);
		jUpload.show().css({"top": -1000});
		jUpload.animate({"top": 0},{"duration":1200,"easing":"easeOutBounce"});

	};

	var onUploadExitClick = function(e)
	{
		jUpload.animate({"top": 1000},{"duration":600,"easing":"easeOutBounce","complete":proxy.onUploadExitComplete});
		jQuery.ajax("/service/s.gallery.php",{
			complete: function(e)
			{
				var galleries = jQuery(e.responseText);
				var galleryLists = jQuery("ul.gallery_list");
				galleries.each(function(i, el)
				{
					var jEl = jQuery(el);
					var id = jEl.data("id");
					var location = jEl.data("location");
					var galleryList = galleryLists.filter("[data-location="+location+"]");
					if(galleryList.children().filter("[data-id="+id+"]").length === 0)
					{
						galleryList.append(jEl);
						jEl.click(onGalleryClick);
					}
				});
			}
		});
	};


	//-------------------------------  Complete Handler

	var onImageFadeOutComplete = function ()
	{
		galleryList.fadeIn({"duration": 500, "easing": "easeInQuart"});
	};

	var onGalleryFadeOutComplete = function ()
	{
		imageContainer.fadeIn({"duration": 500, "easing": "easeInQuart"});
	};

	var onUploadExitComplete =function()
	{
		jUpload.hide().css("top",-1000);
	};

	return Gallery;
}());
com.shabbtech.global.namespace("com.shabbtech.wedding").guestbook = com.shabbtech.global.namespace("com.shabbtech.wedding").guestbook || (function()
{
	"use strict";

	var main;
	var proxy;
	var pageNr,pageAmount;
	var book;
	var nav;

	var GuestBook = function ()
	{
		try
		{
			initialize.call(this);
		}
		catch(err)
		{
			console.error("Error @ GuestBook initialization", err);
		}
	};

	var initialize = function()
	{
		main = jQuery("#main");

		proxy = {};
		proxy.onGuestbookEntryClick = jQuery.proxy(onGuestBookEntryClick, this);
		proxy.onGuestbookEntryPosted = jQuery.proxy(onGuestBookEntryPosted, this);

		BookBlock = new BookBlock(jQuery.proxy(onPageChange, this));
		main.find(".guestbook_form input[type=submit]").click(proxy.onGuestbookEntryClick);

		book = main.find("#bb-bookblock");
		book.find("form").keydown( function(e)
		{
			var keyCode = e.keyCode || e.which;

			if (keyCode == 37 || keyCode == 39)
			{
					e.stopPropagation();
			}
		} );
		nav = main.find("#bb-nav");
		pageNr = 1;
		pageAmount = book.children().length - 1;
		nav.find(".page-count").text("Seite "+pageNr+" von "+pageAmount);
	};




	////////////////////////////////////
	//
	//		Event Handler


	var onPageChange = function(amount, index)
	{
		var items = book.find(".bb-item");
		var oldForm = items.eq(pageNr-1).find("form");
		var newForm = items.eq(index).find("form");

		newForm.find("input[name=name]").val(oldForm.find("input[name=name]").val());
		newForm.find("textarea[name=msg]").val(oldForm.find("textarea[name=msg]").val());

		pageNr = index+1;
		nav.find(".page-count").text("Seite "+pageNr+" von "+pageAmount);
		items.find(".error").removeClass("error");
	};

	var onGuestBookEntryClick = function(e)
	{
		e.preventDefault();

		var target = jQuery(e.currentTarget);
		var form = target.parents(".guestbook_form");
		var msg = form.find("textarea[name=msg]").val();
		var name = form.find("input[name=name]").val();

		jQuery.ajax("/service/s.guestbook.php",{
			dataType: "json",
			type: "POST",
			data:{
				"name": name,
				"msg": msg
			},
			complete: proxy.onGuestbookEntryPosted
		});
	};

	var onGuestBookEntryPosted = function(e, jqXHR)
	{
		var entries = jQuery(".bb-item");
		var data	= e.responseJSON;

		if(e.status === 200)
		{
			var newEntry = entries.eq(0).clone();

			newEntry.find(".name").text(data.name);
			newEntry.find(".date").text(data.date);
			newEntry.find(".msg_container").html(com.shabbtech.global.nl2br(com.shabbtech.global.escapeHtml(data.msg),true));
			entries.eq(0).parent().prepend(newEntry);
			//entries.hide();
			//newEntry.show();
			pageAmount++;
			pageNr = 1;
			nav.find(".page-count").text("Seite "+pageNr+" von "+pageAmount);
			entries.find(".error").removeClass("error");
			book.bookblock('update');
			book.bookblock('first');
		}
		else //error
		{
			for(var i=0;i<data.errorFields.length; i++)
			{
				if(data.errorFields[i] === "name")
				{
					entries.eq(pageNr-1).find("input[name=name]").addClass("error");
				}
				else if(data.errorFields[i] === "msg")
				{
					entries.eq(pageNr-1).find("textarea[name=msg]").addClass("error");
				}
			}
		}
	};




	/////////////////////////////////
	//
	//		BookBlock


	var BookBlock = (function()
	{
		var	onChangeHandler;
		var config;
		var $bookBlock;

		var BookBlock = function(changeHandler)
		{
			onChangeHandler = changeHandler;

			$bookBlock			= jQuery('#bb-bookblock');

			config				= {};
			config.$navNext		= $bookBlock.find( '#bb-nav-next' );
			config.$navPrev		= $bookBlock.find( '#bb-nav-prev' );
			config.$navFirst	= $bookBlock.find( '#bb-nav-first' );
			config.$navLast		= $bookBlock.find( '#bb-nav-last' );
			config.onPageChange	= null;

			$bookBlock.bookblock({
				speed : 800,
				shadowSides : 0.8,
				shadowFlip : 0.7,
				onEndFlip: changeHandler
			});

			initEvents();
		};

		var initEvents = function()
		{
			// add navigation events

			config.$navNext.on('click touchstart', function()
			{
				$bookBlock.bookblock( 'next');
				return false;
			});

			config.$navPrev.on('click touchstart', function()
			{
				$bookBlock.bookblock( 'prev');
				return false;
			});

			config.$navFirst.on('click touchstart', function()
			{
				$bookBlock.bookblock('first');
				return false;
			});

			config.$navLast.on('click touchstart', function()
			{
				$bookBlock.bookblock('last');
				return false;
			});


			// add keyboard events

			jQuery(document).keydown(function(e)
			{
				if(!$bookBlock.is(":visible"))
				{
					return;
				}

				var keyCode = e.keyCode || e.which;
				var	left = 37;
				var right = 39;

				switch (keyCode)
				{
					case left:	$bookBlock.bookblock( 'prev' ); break;
					case right:	$bookBlock.bookblock( 'next' ); break;
				}
			});
		};

		var	setPageChangeHandler = function(handler)
		{
			config.onPageChange = handler;
		};

		return BookBlock;
	}());

	return GuestBook;
}());
com.shabbtech.global.namespace("com.shabbtech.wedding").intro = com.shabbtech.global.namespace("com.shabbtech.wedding").intro || (function()
{
	var body;
	var mountains;
	var txt;
	var intro, main;
	var copyright;
	var bird;
	var skip;
	var nav;
	var vid;
	var logo;
	var skipped = false;

	var Intro = function ()
	{
		try
		{
			initialize.call(this);
		}
		catch(err)
		{
			console.error("Error @ Intro initialization", err);
		}
	};

	var initialize = function ()
	{
		body		= jQuery("body");
		main		= body.find("#main");
		intro		= body.find("#intro");
		txt			= intro.find(".txt");
		skip		= intro.find(".skip");

		logo		= body.find("#logo");
		mountains	= logo.find(".mountains");
		bird		= {};
		bird.green	= logo.find(".bird.green");
		bird.yellow	= logo.find(".bird.yellow");

		copyright	= body.find("#copyright");

		nav			= jQuery("#main_navigation");
		vid			= jQuery(".video_bg video")[0];

		skip.click(onSkipClick);


		body.css("background-color", "#FFFFFF");
		mountains.css("bottom", -mountains.show().height());
		mountains.on("dragstart", function(e){e.preventDefault();});
	};

	Intro.prototype.start = function ()
	{
		intro.show();
		logo.css("height",jQuery(window).innerHeight());
		bird.green.css({"bottom":-bird.green.height(),"left": "60%"});
		bird.yellow.css({"bottom":-bird.yellow.height(),"left": 0});

		body.animate({"background-color": "#fff7e2"}, 3500);
		mountains.animate({bottom: "-5%"}, 2500, "easeOutQuad");
		txt.animate({"font-size": "1.8em", "color": "#484647", "top":0}, 7000, "easeOutQuad");


		setTimeout(function()
		{
			if(skipped)
			{
				return;
			}

			bird.green.animate({"bottom": mountains.height()/2.1,"left": "38%"},4050);
			bird.yellow.animate({"bottom": mountains.height()/2, "left": "25%"},4000);
		},2500);


		setTimeout(function ()
		{
			if(skipped)
			{
				return;
			}

			mountains.animate({"width": 345.6, "bottom": "0"}, 2500, "easeOutQuad");
			txt.animate({"font-size": "0.2em", "color": "#484647", "top": "30%", opacity: 0}, 2500, "easeOutQuad");
			bird.green.animate({"bottom": 85, "left": 130,width:47},2500, "easeOutQuad");
			bird.yellow.animate({"bottom": 87, "left": 85,width:44},2500, "easeOutQuad");
			jQuery(vid).fadeIn()[0].play();
		}, 7000);


		setTimeout(function ()
		{
			if(skipped)
			{
				return;
			}

			nav.animate({"margin-top": 0},500);
			copyright.animate({"bottom":20},500);
			skip.unbind('click').fadeOut();
			bird.green.add(bird.yellow).click(onBirdClick);

		}, 7800);

	};

	var onSkipClick = function(e)
	{
		nav.animate({"margin-top": 0},500);

		intro.fadeOut();
		main.fadeIn();
		mountains.stop().css({"width": 345.6, "bottom": "0"});
		bird.green.stop().css({"bottom": 85, "left": 130,width:47});
		bird.yellow.stop().css({"bottom": 87, "left": 85,width:44});
		jQuery(vid).fadeIn()[0].play();
		skipped = true;
		bird.green.add(bird.yellow).click(onBirdClick);
	};

	var onBirdClick = function()
	{
		if(vid.paused)
		{
			vid.play();
		}
		else
		{
			vid.pause();
		}
	};

	return Intro;
}());
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
com.shabbtech.global.namespace("com.shabbtech.wedding").navigation = com.shabbtech.global.namespace("com.shabbtech.wedding").navigation || (function()
{
	"use strict";

	var IN=0,OUT=1;
	var transitionDuration = 1000;

	var root;
	var main;
	var lvl1Buttons;
	var lvl2;
	var lvl2links;
	var animationActive;
	var proxy;
	var nav;
	var horizontalTransitionActive = false;

	var Nav = function ()
	{
		try
		{
			initialize.call(this);
		}
		catch(err)
		{
			console.err("Error on Navigation initialization", err);
		}
	};

	var initialize = function ()
	{
		root				= jQuery("#root");
		main				= root.find("#main");
		nav					= main.find("#main_navigation");
		animationActive		= [];

		lvl1Buttons			= nav.find(".lvl1.wrapper");
		this.Lvl1Wrapper	= lvl1Buttons;

		lvl2				= this.Lvl1Wrapper.find(".lvl2");
		lvl2links			= lvl2.find(">li");
		this.Lvl2Wrapper	= lvl2;

		proxy = {};
		proxy.onLinkClickProxy					= jQuery.proxy(onLinkClick, this);
		proxy.onContentAnimationCompleteProxy	= jQuery.proxy(onContentAnimationComplete, this);

		lvl2.each(function(i,element)
		{
			var el = jQuery(element).show();
			el.css("bottom", el.height());
		});

		lvl2links.add(nav.find(".link")).click(proxy.onLinkClickProxy);

		lvl1Buttons.each(function(i,element)
		{
			var idx = lvl1Buttons.index(element);
			animationActive[idx] = [];
			animationActive[idx][IN] = false;
			animationActive[idx][OUT] = false;
		});

		if(Modernizr.touch)
		{
			lvl1Buttons.click(onLvl1Touch);
		}
		else
		{
			lvl1Buttons.hover(onLvl1HoverIn,onLvl1HoverOut);
		}

		//jQuery(document).bind('mousewheel DOMMouseScroll', onMouseWheelChange);

		return this;
	};


	///////////////////////////////////////
	//
	//		Event Handler



//-----------------------------------------  HoverEvent Handler

	var onLvl1HoverIn = function(e)
	{
		var wrapper = jQuery(e.currentTarget);
		var idx = lvl1Buttons.index(wrapper);

		animationActive[idx][OUT] = false;

		if(animationActive[idx][OUT])
		{
			return;
		}

		animationActive[idx][OUT] = true;
		wrapper.stop().animate({"background-color": "rgba(68, 68, 68, 0.4)", "color": "#fff7e2"});
		var currentLvl2 = wrapper.find(".lvl2");
		currentLvl2.show();

		currentLvl2.stop().animate({"bottom": -currentLvl2.height(), "opacity": 1},800,"easeOutExpo");
	};


	var onLvl1HoverOut = function(e)
	{
		var wrapper = jQuery(e.currentTarget);
		var idx = lvl1Buttons.index(wrapper);
		animationActive[idx][IN] = false;

		if(animationActive[idx][IN])
		{
			return;
		}

		animationActive[idx][IN] = true;

		lvl1Buttons.filter(".active").stop().animate({"background-color": "rgba(0,0,0, 0.1)", "color": "#444444"});
		lvl1Buttons.not(".active").stop().animate({"background-color": "transparent", "color": "#444444"});

		var currentLvl2 = wrapper.find(".lvl2");

		currentLvl2.stop().animate({"bottom": 0, "opacity": 0},800,"easeOutExpo");
	};



//-----------------------------------------  Touch/Click Handler

	var onLvl1Touch = function(e)  //onl
	{
		var jTarget = jQuery(e.currentTarget);
		if(jTarget.hasClass("touch_active"))
		{
			onLvl1HoverOut(e);
			jTarget.removeClass("touch_active");
		}
		else
		{
			onLvl1HoverIn(e);
			jTarget.addClass("touch_active");
		}
	};


	var onLinkClick = function(e)
	{
		if (horizontalTransitionActive)
		{
			return;
		}

		var oldLvl2Item = jQuery("#main_navigation .lvl2 > li.active");
		var oldIndex = oldLvl2Item.parent().find(">li").index(oldLvl2Item);
		var jTarget = jQuery(e.currentTarget);

		if(oldLvl2Item.is(jTarget) || jTarget.data("rel") === "guestbook" && jQuery("#pages").children().filter(".active").attr("id") === "guestbook")
		{
			return;
		}

		horizontalTransitionActive = true;
		lvl2links.removeClass("active");
		lvl1Buttons.removeClass("active");

		jTarget.parents(".lvl1 .wrapper").addClass("active");
		jTarget.addClass("active");
		var jCategory = jTarget.hasClass("category") ? jTarget : jTarget.parents(".category");
		var jLvl2Entries = jCategory.find(".lvl2 > li");
		var newIndex = jLvl2Entries.index(jTarget);

		this.oldContentCategory = this.newContentCategory || jQuery();
		this.oldContent = this.newContent || jQuery();
		this.newContentCategory = main.find("#"+jCategory.data("rel"));
		this.newContent = this.newContentCategory.find(".wrapper").eq(newIndex);
		this.newContent.addClass("active");

		categoryTransition.call(this, oldIndex, newIndex);
		root.css("overflow","hidden");
	};


//-----------------------------------------  WheelChangeHandler

	var onMouseWheelChange = function(e)
	{
		var oldLvl2Item = jQuery("#main_navigation .lvl2 > li.active");
		var listItems = oldLvl2Item.parent().find(">li");
		var oldIndex = listItems.index(oldLvl2Item);
		var newItem;

		if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0)
		{
			newItem = listItems.eq(oldIndex-1)[0];
		}
		else
		{
			newItem = listItems.eq(oldIndex+1)[0];
		}

		onLinkClick.call(this, {currentTarget: newItem});
	};


//-----------------------------------------  Complete Handler

	var onContentAnimationComplete = function()
	{
		this.oldContent.removeClass("active");
		this.oldContent.css("margin-top",0);
		this.newContent.siblings().removeClass("active");
		this.newContent.find(".bg_color").removeClass("extended");
		this.oldContent.find(".bg_color").removeClass("extended");

		if(!this.newContentCategory.is(this.oldContentCategory))
		{
			this.oldContentCategory.removeClass("active");
		}

		horizontalTransitionActive = false;
	};


	///////////////////////////////////
	//
	//		Helper Functions


	var categoryTransition = function(oldIndex, newIndex)
	{
		var heightDistance = 1000;
		var contentAnimation;

		this.newContentCategory.addClass("active");
		if(this.oldContentCategory.length === 0) //first content
		{
			$(window).trigger('resize');
			if(this.newContentCategory.attr("id") === "guestbook") //first content == guestbook
			{
				this.newContentCategory.css({"margin-top": -heightDistance, "opacity": 0});
			}
			else
			{
				this.newContentCategory.css({"margin-top": heightDistance, "opacity": 0});
			}
			this.newContentCategory.stop().animate({"margin-top": 0, "opacity": 1}, transitionDuration, proxy.onContentAnimationCompleteProxy);
			this.oldContentCategory.stop().animate({"margin-top": -heightDistance}, transitionDuration,  proxy.onContentAnimationCompleteProxy);
		}
		else if(this.newContentCategory.attr("id") === "guestbook") //new content == guestbook
		{
			this.newContentCategory.css({"margin-top": heightDistance,"margin-left": 0});
			this.newContentCategory.stop().animate({"margin-top": 0}, transitionDuration,  proxy.onContentAnimationCompleteProxy);
			this.oldContentCategory.stop().animate({"margin-top": -heightDistance}, transitionDuration,  proxy.onContentAnimationCompleteProxy);
		}
		else if(this.oldContentCategory.attr("id") === "guestbook") //old content == guestbook
		{
			this.newContentCategory.css({"margin-top": -heightDistance,"margin-left": 0});
			this.newContentCategory.stop().animate({"margin-top": 0}, transitionDuration,  proxy.onContentAnimationCompleteProxy);
			this.oldContentCategory.stop().animate({"margin-top": heightDistance}, transitionDuration,  proxy.onContentAnimationCompleteProxy);
		}
		else if(this.newContentCategory.data("order") > this.oldContentCategory.data("order")) // content left
		{
			this.newContentCategory.css({"margin-left": "100%","margin-top": 0});
			contentAnimation = {
				new :{"margin-left": 0},
				old:{"margin-left": "-100%"}
			};

			contentAnimation = verticalTransition.call(this, oldIndex, newIndex, contentAnimation, heightDistance);

			this.newContentCategory.stop().animate(contentAnimation.new, transitionDuration,  proxy.onContentAnimationCompleteProxy);
			this.oldContentCategory.stop().animate(contentAnimation.old, transitionDuration,  proxy.onContentAnimationCompleteProxy);
		}
		else if (this.newContentCategory.data("order") < this.oldContentCategory.data("order")) // content right
		{
			this.newContentCategory.css({"margin-left": "-100%","margin-top": 0});
			contentAnimation = {
				new :{"margin-left": 0},
				old:{"margin-left": "100%"}
			};

			contentAnimation = verticalTransition.call(this, oldIndex, newIndex, contentAnimation, heightDistance);

			this.newContentCategory.stop().animate(contentAnimation.new, transitionDuration,  proxy.onContentAnimationCompleteProxy);
			this.oldContentCategory.stop().animate(contentAnimation.old, transitionDuration,  proxy.onContentAnimationCompleteProxy);
		}
		else
		{
			contentAnimation = {
				new :{},
				old:{}
			};

			if(oldIndex > newIndex) // content down
			{
				this.newContent.css({"margin-top": -heightDistance, "margin-left":0});
				contentAnimation.new.marginTop = 0;
				contentAnimation.old.marginTop = heightDistance;
			}
			else if(oldIndex < newIndex) // content up
			{
				this.newContent.css({"margin-top": heightDistance, "margin-left":0});
				contentAnimation.new.marginTop = 0;
				contentAnimation.old.marginTop = -heightDistance;
			}
			this.newContent.stop().animate(contentAnimation.new, transitionDuration,  proxy.onContentAnimationCompleteProxy);
			this.oldContent.stop().animate(contentAnimation.old, transitionDuration,  proxy.onContentAnimationCompleteProxy);

			colorCorrect.call(this, oldIndex, newIndex);
		}
	};

	var verticalTransition = function(oldIndex, newIndex, contentAnimation, heightDistance)
	{
		if(oldIndex != newIndex)
		{
			this.newContent.find(".bg_color").addClass("extended");
			this.oldContent.find(".bg_color").addClass("extended");
		}

		if(oldIndex > newIndex) // content down
		{
			this.newContentCategory.css({"margin-top": -heightDistance});
			contentAnimation.new.marginTop = 0;
			contentAnimation.old.marginTop = heightDistance;
		}
		else if(oldIndex < newIndex) // content up
		{
			this.newContentCategory.css({"margin-top": heightDistance});
			contentAnimation.new.marginTop = 0;
			contentAnimation.old.marginTop = -heightDistance;
		}

		colorCorrect.call(this, oldIndex, newIndex);

		return contentAnimation;
	};

	var colorCorrect = function(oldIndex, newIndex)
	{
		var bgColor = this.newContent.find(".bg_color");

		if(this.oldContent.find(".bg_color").hasClass("green"))
		{
			if(oldIndex === newIndex)
			{
				bgColor.addClass("green");
			}
			else
			{
				bgColor.removeClass("green");
			}
		}
		else
		{
			if(oldIndex === newIndex)
			{
				bgColor.removeClass("green");
			}
			else
			{
				bgColor.addClass("green");
			}
		}
	};

	return Nav;
}());
com.shabbtech.global.namespace("com.shabbtech.wedding").upload = com.shabbtech.global.namespace("com.shabbtech.wedding").upload || (function()
{
	var uploadTrigger = jQuery("#triggerUpload");
	var ul = jQuery("#upload ul");
	var _data = [];
	var uploadItemTpl = jQuery('<li class="working"><div class="loading"></div><div class="img_info"><span class="name"></span><span class="size"></span></div></li>');
	var removeBtnTpl = jQuery('<a href="#" class="remove">X</a>');

	var Upload = function()
	{
		try
		{
			initialize.call(this);
		}
		catch(err)
		{
			console.error("Error on Upload Initialization", err);
		}
	};

	var initialize = function()
	{
		uploadTrigger.click(onUploadTriggerClick);
		jQuery("#drop a").click(onDropClick);


		jQuery(document).on('drop dragover', function (e)	// Prevent the default action when a file is dropped on the window
		{
			e.preventDefault();
		});

		// Initialize the jQuery File Upload plugin
		jQuery('#upload').fileupload({
			dropZone: $('#drop'),							// This element will accept file drag/drop uploading
			add: onUploadAdd,
			progress: onUploadProgress,
			complete: onUploadComplete,
			fail: onUploadFail
		});
	};



	///////////////////////////////////////////////
	//
	//		Event Handler


	//-------------------------------------  Click handler


	var onDropClick = function()									// Simulate a click on the file input button to show the file browser dialog
	{
		jQuery(this).parent().find('input').click();
	};


	var onUploadTriggerClick = function()
	{
		var el;
		var inputPoster = _data[0].form.find('input[name=poster]');

		if(inputPoster.val().length <=0)
		{
			inputPoster.val(_data[0].files[0].name);
		}

		ul.children().filter(":hidden").remove();

		_data = _data.reverse();

		for(var i=0;_data.length>0;i++)
		{
			el = _data.pop();
			if(el.context.hasClass("poster"))
			{
				el.form.find('input[name=poster]').val(el.files[0].name);
			}
			el.form.find('input[name=index]').val(i);

			el.submit();
		}
	};


	var onRemoveUploadClick = function(e)
	{
		e.preventDefault();

		var jTarget = jQuery(e.currentTarget);
		var context = jTarget.parent();

		context.remove();

		for(var i=0; i<_data.length; i++)
		{
			if(context.is(_data[i].context))
			{
				_data.splice(i, 1);
			}
		}
	};



	//-------------------------------------  Progress handler


	var onUploadComplete = function(e,data)
	{
		var index = e.responseText.match(/index":([0-9]+)\}/)[1];
		jQuery("#upload .preview_list > li").eq(index).fadeOut();
	};


	var onUploadFail = function(e, data)
	{
		data.context.addClass('error');
	};


	var onUploadProgress = function(e, data)
	{
		// Calculate the completion percentage of the upload
		var progress = parseInt(data.loaded / data.total * 100, 10);

		// Update the hidden input field and trigger a change
		// so that the jQuery knob plugin knows to update the dial
		data.context.find('.loading').css("width",progress+"%");

		if(progress == 100)
		{
			data.context.removeClass('working');
		}
	};


	var onUploadAdd = function (e, data)					// This function is called when a file is added to the queue;
	{
		var uploadTrigger	= jQuery("#triggerUpload");
		var tpl				= uploadItemTpl.clone();
		var removeBtn		= removeBtnTpl.clone();

		if(uploadTrigger.not(":visible"))
		{
			uploadTrigger.fadeIn();
		}

		if(ul.children().filter(":visible").length === 0)
		{
			tpl.addClass("poster");
			data.form.find("input[name=poster]").val(data.files[0].name);
		}

		// Append the file name and file size
		tpl.find('.name').text(data.files[0].name);
		tpl.find('.size').text(formatFileSize(data.files[0].size));


		_data.push(data);


		var onCancelClick = function()
		{
			if(tpl.hasClass('working'))
			{
				jqXHR.abort();
			}

			tpl.fadeOut(function()
			{
				tpl.remove();
			});
		};

		var onUploadItemClick = function()
		{
			tpl.siblings().removeClass("poster");
			tpl.addClass("poster");
		};


		tpl.append(removeBtn);
		tpl.click(onUploadItemClick);
		tpl.find('span').click(onCancelClick);
		removeBtn.click(onRemoveUploadClick);

		data.context = tpl.appendTo(ul);
	};



	///////////////////////////////////
	//
	//		Helper functions


	var readImage = function(file, previewContainer)
	{
		var reader	= new FileReader();
		var image	= new Image();

		reader.readAsDataURL(file);
		reader.onload = function(_file)
		{
			image.src    = _file.target.result;
			image.onload = function()
			{
				var w = this.width,
					h = this.height,
					t = file.type,
					n = file.name,
					s = ~~(file.size/1024) +'KB';

				previewContainer.prepend('<div class="img_container"><img src="'+ this.src +'" height="110"><span class="res">'+w+'x'+h+'</span><span class="type">'+t+'</span></div>');
			};
			image.onerror = function()
			{
				alert('Invalid file type: '+ file.type);
			};
		};
	};


	var formatFileSize = function(bytes)
	{
		if (typeof bytes !== 'number')
		{
			return '';
		}

		if (bytes >= 1000000000)
		{
			return (bytes / 1000000000).toFixed(2) + ' GB';
		}

		if (bytes >= 1000000)
		{
			return (bytes / 1000000).toFixed(2) + ' MB';
		}
		return (bytes / 1000).toFixed(2) + ' KB';
	};


	return Upload;
}());
