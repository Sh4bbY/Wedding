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