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
