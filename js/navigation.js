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