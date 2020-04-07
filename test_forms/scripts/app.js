/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2014 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any. The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 *
 **************************************************************************/

/**
 *  A static JavaScript object that represents the Acrobat application. It defines a number 
 *  of Acrobat-specific functions plus a variety of utility routines and convenience functions.
 *
 *  @class App
 */
function PdfjsAppEmulator()
{
};

PdfjsAppEmulator.prototype =
{
	/**
	 *  The language code of the running application.
	 *
	 *  @property language
	 *  @type {String}
	 *  @readOnly
	 */
	get language()
	{
		return ARJavaScriptApp.language;
	},
	
	/**
	 *  The platform the script is currently executing on.
	 *
	 *  @property platform
	 *  @type {String}
	 *  @readOnly
	 */
	get platform()
	{
		return ARJavaScriptApp.platform;
	}
};

/**
 *  Displays an alert dialog box.
 *
 *  @method alert
 *  @param cMsg {String} A string containing the message to be displayed.
 *  @return {Number} The type of button that was tapped by the user: 1-OK, 2-Cancel, 3-No, 4-Yes.
 */
PdfjsAppEmulator.prototype.alert = function(cMsg, nIcon)
{
	return alert(cMsg + "");
};

/**
 *  [Unimplemented]
 *
 *  @private
 *  @method beep
 *  @param nType {Number}
 */
PdfjsAppEmulator.prototype.beep = function(nType)
{
	// do nothing
};


function registerUndefinedProperty(proto, name, extension)
{
	proto[extension] = function () {
        
    };
}

PdfjsAppEmulator.prototype.dateFormat = function (x, y) {
    var z = {
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
    });

    return y.replace(/(y+)/g, function(v) {
        return x.getFullYear().toString().slice(-v.length)
    });
};

// register undefined properties on the App.prototype object
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'activeDocs');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'calculate');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'constants');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'focusRect');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'formsVersion');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'fromPDFConverters');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'fs');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'fullscreen');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'media');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'monitors');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'numPlugIns');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'openInPlace');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'plugIns');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'printColorProfiles');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'printerNames');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'runtimeHighlight');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'runtimeHighlightColor');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'thermometer');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'toolbar');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'toolbarHorizontal');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'toolbarVertical');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'viewerType');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'viewerVariation');
registerUndefinedProperty(PdfjsAppEmulator.prototype, 'pdfjsAppEmulator', 'viewerVersion');

// instantiate object
var app = new PdfjsAppEmulator();