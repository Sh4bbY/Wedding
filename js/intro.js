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