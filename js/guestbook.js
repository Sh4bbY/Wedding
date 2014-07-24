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