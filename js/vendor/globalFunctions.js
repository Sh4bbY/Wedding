if ("undefined" === typeof com)
{
    var com;
}
com = com || {};
com.shabbtech = com.shabbtech || {};
com.shabbtech.global = com.shabbtech.global || {};



/////////////////////////////       AVOID CONSOLE ERRORS
/**
 * if the browser does not support console operations,
 * all console methods will be overwritten with a empty function to prevent js errors
 */
com.shabbtech.global.avoidConsoleErrors = function()
{
	"use strict";

	if (!(window.console && console.log))
	{
		(function() {
			var noop = function() {};
			var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
			var length = methods.length;
			var console = window.console = {};
			while (length--) {
				console[methods[length]] = noop;
			}
		}());
	}
}();



/////////////////////////////       NAMESPACE
/**
 * returns or creates the packageObject of the given packagePath in the given rootScope.
 * if rootScope is not given, it will be the window object per default
 *
 * @param arg1 = packageString
 * @param arg1 = rootScope & arg2 = packageString
 */
com.shabbtech.global.namespace = function(arg1, arg2)
{
	"use strict";

    var rootScope;
    var packagePath;

    if(typeof arg1 === "string" && typeof arg2 === "undefined")
    {
        rootScope = window;
        packagePath = arg1;
    }
    else if(arg1 instanceof Object && typeof arg2 === "string")
    {
        rootScope = arg1;
        packagePath = arg2;
    }
    else
    {
        console.error("Invalid arguments for namespace");
        return;
    }

    var packageNames = packagePath.split(".");
    var packageAmount = packageNames.length;
    var scope = rootScope;
    var packageName;

    for(var i=0; i < packageAmount; i++)
    {
        packageName = jQuery.trim(packageNames[i]).toLowerCase();
        scope[packageName] = scope[packageName] || {};
        scope = scope[packageName];
    }

    return scope;
};



/////////////////////////////       GET URL PARAMETERS
/**
 * if arg1 is undefined, the function will return all urlParameters in json format.
 * if arg1 is a key(typeof String), the function will return the value of the key or false
 * if arg1 is instanceof Array<keys>, the function will return a map of all values for the given keys
 * or false if no such key was found
 *
 * @param arg1 = undefined | key | Array <keys>
 */
com.shabbtech.global.getUrlParameter = function(arg1)
{
	"use strict";

	var parameterString = window.location.search.substring(1);
    var vars = parameterString.split("&");
    var result = {};


    var pair, key, value, arr;
    for (var i=0; i < vars.length; i++)
    {
        pair = vars[i].split("=");
        key = pair[0];
        value = pair[1];

        if (typeof result[key] === "undefined")
        {
            result[key] = value;
        }
        else if (typeof result[key] === "string")
        {
            arr = [result[key], value];
            result[key] = arr;
        }
        else if(result[result[key]])
        {
            result[key].push(value);
        }
    }

    if(typeof arg1 === "string")
    {
        return result[arg1] || false;
    }

    if(arg1 instanceof Array)
    {
        for(i=0; i < arg1.length; i++)
        {
            if(result.hasOwnProperty(arg1[i]))
            {
               return result;
            }
            return false;
        }
    }

    return result;
};



com.shabbtech.global.resize = new (function()
{
	"use strict";

	var resizeCheckInterval = 500;
	var screenSizeHasChanged = false;
    var functions;
	var jWindow = jQuery(window);

    var Resize = function()
    {
        functions = [];
		screenSizeHasChanged = false;
		jWindow.resize(onResize);
    };

	Resize.prototype.addFunction = function(fkt,condition,callOnBegin)
    {
        if(fkt instanceof Function)
        {
            functions.push({
				fkt: fkt,
				condition: condition
            });

			if(callOnBegin === true)
			{
				fkt();
			}

            return true;
        }
        return false;
    };

	Resize.prototype.setCheckInterval = function(checkInterval)
	{
		resizeCheckInterval = checkInterval;
	};

	Resize.prototype.clear = function()
    {
        functions = [];
    };

    var onResize = function()
    {
        screenSizeHasChanged = true;
		window.setTimeout(checkResizeFunctions, resizeCheckInterval);
		jWindow.unbind("resize",onResize);
    };

    var checkResizeFunctions = function()
    {
        if(screenSizeHasChanged)
        {
            for(var i=0; i < functions.length; i++)
            {
				if(!(functions[i].condition instanceof Function) && functions[i].condition !== false || ((functions[i].condition instanceof Function) && functions[i].condition(jWindow)))
				{
					functions[i].fkt();
				}
            }

			jWindow.resize(onResize);
        }
    };

	return Resize;
}())();


com.shabbtech.global.nl2br = function(str, is_xhtml)
{
	var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
};

com.shabbtech.global.escapeHtml = function(text)
{
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
};