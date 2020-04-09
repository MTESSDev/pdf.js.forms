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
	if (console) {
		console.info(cMsg + "");
		return true;
	} else {
		return true;
	}
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
function PdfjsBorderEmulator()
{
};

PdfjsBorderEmulator.prototype =
{
	/**
	 *  The language code of the running application.
	 *
	 *  @property language
	 *  @type {String}
	 *  @readOnly
	 */
	set s(val)
	{

	},
	
	/**
	 *  The platform the script is currently executing on.
	 *
	 *  @property platform
	 *  @type {String}
	 *  @readOnly
	 */
	get s()
	{
		return "";
	}
};


// instantiate object
var border = new PdfjsBorderEmulator();
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
 *  This object represents an Acrobat form field (that is, a field created using the Acrobat 
 *  form tool or the Doc addField method). In the same manner that a form author can modify an 
 *  existing field's properties, the JavaScript user can use the Field object to perform the
 *  same modifications.
 *
 *  @class Field
 *  @param field {Object} The underlying field.
 */
function Field(field)
{
	this.field = field;
};

Field.prototype = 
{
	/**
	 *  This property returns the fully qualified field name of the field as a string object.
	 *
	 *  @property name
	 *  @type {String}
	 */
	get name()
	{
		return this.field.name;
	},
	
	/**
	 *  Returns the type of the field as a string.
	 *
	 *  @property type
	 *  @type {String}
	 *  @readonly
	 */
	get type()
	{
		return this.field.type;
	},
	
	/**
	 *  The value of the field data that the user has entered. Depending on the type of the field, 
	 *  may be a String, Date, or Number. Typically, the value is used to create calculated fields.
	 *
	 *  @property value
	 *  @type {Any}
	 */
	get value()
	{
		/* var returnVal;
		
		 var _val = this.field.value;
		if (typeof _val == 'number' || ! isNaN(_val))
		{
			if (typeof _val == 'string')
			{
				if (_val.trim() != "")
					returnVal = parseFloat(_val);
				else
					returnVal = _val;
			}
			else
			{
				returnVal = parseFloat(_val);
			}
		}
		else
		{
			returnVal = _val;
		} */
		
		if (this.field.type == 'checkbox') {
			return (this.field.checked ? 'On' : 'Off');
		} else {
			return _val;
		}
	},
	set value(_val)
	{
		if (this.field.type == 'checkbox') {
			this.field.checked = (_val=='Off' ? false : true);
		} else {
			this.field.value = _val;
		}
	},
	
	/**
	 *  The foreground color of a field. It represents the text color for text, button, 
	 *  or list box fields and the check color for check box or radio button fields.  Values
	 *  are defined by Color arrays.
	 *
	 *  @private
	 *  @property textColor
	 *  @type {Object}
	 */
	set textColor(_textColor)
	{
		this.field.textColor = _textColor;
	}
};

/**
 *  Gets the array of terminal child fields (that is, fields that can have a value) for 
 *  this Field object, the parent field.
 *
 *  @method getArray
 *  @return {Object} An array of Field objects.
 */
Field.prototype.getArray = function()
{
	var returnVal = new Array();
	
	var fieldsArray = this.field.getArray();
	if (fieldsArray)
	{
		// iterate array of field names and create field objects
		for (var index = 0; index < fieldsArray.length; index++)
		{
			returnVal[index] = new Field(fieldsArray[index]);
		}
	}
	
	return returnVal;
};

/**
 *  Sets the focus to this field. This can involve changing the page that the user is 
 *  currently on or causing the view to scroll to a new position in the document.
 *
 *  @method setFocus
 */
Field.prototype.setFocus = function()
{
	this.field.setFocus();
};

Field.prototype.getField = function(id)
{
	return new Field(document.getElementById(id));
};

// register undefined properties on the Field.prototype object
registerUndefinedProperty(Field.prototype, 'Field', 'alignment');
registerUndefinedProperty(Field.prototype, 'Field', 'borderStyle');
registerUndefinedProperty(Field.prototype, 'Field', 'buttonAlignX');
registerUndefinedProperty(Field.prototype, 'Field', 'buttonAlignY');
registerUndefinedProperty(Field.prototype, 'Field', 'buttonFitBounds');
registerUndefinedProperty(Field.prototype, 'Field', 'buttonPosition');
registerUndefinedProperty(Field.prototype, 'Field', 'buttonScaleHow');
registerUndefinedProperty(Field.prototype, 'Field', 'buttonScaleWhen');
registerUndefinedProperty(Field.prototype, 'Field', 'calcOrderIndex');
registerUndefinedProperty(Field.prototype, 'Field', 'charLimit');
registerUndefinedProperty(Field.prototype, 'Field', 'comb');
registerUndefinedProperty(Field.prototype, 'Field', 'commitOnSelChange');
registerUndefinedProperty(Field.prototype, 'Field', 'currentValueIndices');
registerUndefinedProperty(Field.prototype, 'Field', 'defaultStyle');
registerUndefinedProperty(Field.prototype, 'Field', 'defaultValue');
registerUndefinedProperty(Field.prototype, 'Field', 'doNotScroll');
registerUndefinedProperty(Field.prototype, 'Field', 'doNotSpellCheck');
registerUndefinedProperty(Field.prototype, 'Field', 'delay');
registerUndefinedProperty(Field.prototype, 'Field', 'display');
registerUndefinedProperty(Field.prototype, 'Field', 'doc');
registerUndefinedProperty(Field.prototype, 'Field', 'editable');
registerUndefinedProperty(Field.prototype, 'Field', 'exportValues');
registerUndefinedProperty(Field.prototype, 'Field', 'fileSelect');
registerUndefinedProperty(Field.prototype, 'Field', 'fillColor');
registerUndefinedProperty(Field.prototype, 'Field', 'hidden');
registerUndefinedProperty(Field.prototype, 'Field', 'highlight');
registerUndefinedProperty(Field.prototype, 'Field', 'lineWidth');
registerUndefinedProperty(Field.prototype, 'Field', 'multiline');
registerUndefinedProperty(Field.prototype, 'Field', 'multipleSelection');
registerUndefinedProperty(Field.prototype, 'Field', 'numItems');
registerUndefinedProperty(Field.prototype, 'Field', 'page');
registerUndefinedProperty(Field.prototype, 'Field', 'password');
registerUndefinedProperty(Field.prototype, 'Field', 'print');
registerUndefinedProperty(Field.prototype, 'Field', 'radiosInUnison');
registerUndefinedProperty(Field.prototype, 'Field', 'readonly');
registerUndefinedProperty(Field.prototype, 'Field', 'rect');
registerUndefinedProperty(Field.prototype, 'Field', 'required');
registerUndefinedProperty(Field.prototype, 'Field', 'richText');
registerUndefinedProperty(Field.prototype, 'Field', 'richValue');
registerUndefinedProperty(Field.prototype, 'Field', 'rotation');
registerUndefinedProperty(Field.prototype, 'Field', 'strokeColor');
registerUndefinedProperty(Field.prototype, 'Field', 'style');
registerUndefinedProperty(Field.prototype, 'Field', 'submitName');
registerUndefinedProperty(Field.prototype, 'Field', 'textFont');
registerUndefinedProperty(Field.prototype, 'Field', 'textSize');
registerUndefinedProperty(Field.prototype, 'Field', 'userName');
registerUndefinedProperty(Field.prototype, 'Field', 'valueAsString');
/* global window, exports, define */

!function() {
    'use strict'

    var re = {
        not_string: /[^s]/,
        not_bool: /[^t]/,
        not_type: /[^T]/,
        not_primitive: /[^v]/,
        number: /[diefg]/,
        numeric_arg: /[bcdiefguxX]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[+-]/
    }

    function sprintf(key) {
        // `arguments` is not an array, but should be fine for this call
        return sprintf_format(sprintf_parse(key), arguments)
    }

    function vsprintf(fmt, argv) {
        return sprintf.apply(null, [fmt].concat(argv || []))
    }

    function sprintf_format(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, arg, output = '', i, k, ph, pad, pad_character, pad_length, is_positive, sign
        for (i = 0; i < tree_length; i++) {
            if (typeof parse_tree[i] === 'string') {
                output += parse_tree[i]
            }
            else if (typeof parse_tree[i] === 'object') {
                ph = parse_tree[i] // convenience purposes only
                if (ph.keys) { // keyword argument
                    arg = argv[cursor]
                    for (k = 0; k < ph.keys.length; k++) {
                        if (arg == undefined) {
                            throw new Error(sprintf('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k-1]))
                        }
                        arg = arg[ph.keys[k]]
                    }
                }
                else if (ph.param_no) { // positional argument (explicit)
                    arg = argv[ph.param_no]
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++]
                }

                if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && arg instanceof Function) {
                    arg = arg()
                }

                if (re.numeric_arg.test(ph.type) && (typeof arg !== 'number' && isNaN(arg))) {
                    throw new TypeError(sprintf('[sprintf] expecting number but found %T', arg))
                }

                if (re.number.test(ph.type)) {
                    is_positive = arg >= 0
                }

                switch (ph.type) {
                    case 'b':
                        arg = parseInt(arg, 10).toString(2)
                        break
                    case 'c':
                        arg = String.fromCharCode(parseInt(arg, 10))
                        break
                    case 'd':
                    case 'i':
                        arg = parseInt(arg, 10)
                        break
                    case 'j':
                        arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0)
                        break
                    case 'e':
                        arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential()
                        break
                    case 'f':
                        arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg)
                        break
                    case 'g':
                        arg = ph.precision ? String(Number(arg.toPrecision(ph.precision))) : parseFloat(arg)
                        break
                    case 'o':
                        arg = (parseInt(arg, 10) >>> 0).toString(8)
                        break
                    case 's':
                        arg = String(arg)
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 't':
                        arg = String(!!arg)
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 'T':
                        arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 'u':
                        arg = parseInt(arg, 10) >>> 0
                        break
                    case 'v':
                        arg = arg.valueOf()
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 'x':
                        arg = (parseInt(arg, 10) >>> 0).toString(16)
                        break
                    case 'X':
                        arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase()
                        break
                }
                if (re.json.test(ph.type)) {
                    output += arg
                }
                else {
                    if (re.number.test(ph.type) && (!is_positive || ph.sign)) {
                        sign = is_positive ? '+' : '-'
                        arg = arg.toString().replace(re.sign, '')
                    }
                    else {
                        sign = ''
                    }
                    pad_character = ph.pad_char ? ph.pad_char === '0' ? '0' : ph.pad_char.charAt(1) : ' '
                    pad_length = ph.width - (sign + arg).length
                    pad = ph.width ? (pad_length > 0 ? pad_character.repeat(pad_length) : '') : ''
                    output += ph.align ? sign + arg + pad : (pad_character === '0' ? sign + pad + arg : pad + sign + arg)
                }
            }
        }
        return output
    }

    var sprintf_cache = Object.create(null)

    function sprintf_parse(fmt) {
        if (sprintf_cache[fmt]) {
            return sprintf_cache[fmt]
        }

        var _fmt = fmt, match, parse_tree = [], arg_names = 0
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree.push(match[0])
            }
            else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree.push('%')
            }
            else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1
                    var field_list = [], replacement_field = match[2], field_match = []
                    if ((field_match = re.key.exec(replacement_field)) !== null) {
                        field_list.push(field_match[1])
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1])
                            }
                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1])
                            }
                            else {
                                throw new SyntaxError('[sprintf] failed to parse named argument key')
                            }
                        }
                    }
                    else {
                        throw new SyntaxError('[sprintf] failed to parse named argument key')
                    }
                    match[2] = field_list
                }
                else {
                    arg_names |= 2
                }
                if (arg_names === 3) {
                    throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported')
                }

                parse_tree.push(
                    {
                        placeholder: match[0],
                        param_no:    match[1],
                        keys:        match[2],
                        sign:        match[3],
                        pad_char:    match[4],
                        align:       match[5],
                        width:       match[6],
                        precision:   match[7],
                        type:        match[8]
                    }
                )
            }
            else {
                throw new SyntaxError('[sprintf] unexpected placeholder')
            }
            _fmt = _fmt.substring(match[0].length)
        }
        return sprintf_cache[fmt] = parse_tree
    }

    /**
     * export to either browser or node.js
     */
    /* eslint-disable quote-props */
    if (typeof exports !== 'undefined') {
        exports['sprintf'] = sprintf
        exports['vsprintf'] = vsprintf
    }
    if (typeof window !== 'undefined') {
        window['sprintf'] = sprintf
        window['vsprintf'] = vsprintf

        if (typeof define === 'function' && define['amd']) {
            define(function() {
                return {
                    'sprintf': sprintf,
                    'vsprintf': vsprintf
                }
            })
        }
    }
    /* eslint-enable quote-props */
}(); // eslint-disable-line

Error.prototype.toString = function() {
	if (this.stackTrace) return this.name + ': ' + this.message + this.stackTrace;
	return this.name + ': ' + this.message;
};

// display must be kept in sync with an enum in pdf_form.c
var display = {
	visible: 0,
	hidden: 1,
	noPrint: 2,
	noView: 3,
};

var border = {
	b: 'beveled',
	d: 'dashed',
	i: 'inset',
	s: 'solid',
	u: 'underline',
};

var color = {
	transparent: [ 'T' ],
	black: [ 'G', 0 ],
	white: [ 'G', 1 ],
	gray: [ 'G', 0.5 ],
	ltGray: [ 'G', 0.75 ],
	dkGray: [ 'G', 0.25 ],
	red: [ 'RGB', 1, 0, 0 ],
	green: [ 'RGB', 0, 1, 0 ],
	blue: [ 'RGB', 0, 0, 1 ],
	cyan: [ 'CMYK', 1, 0, 0, 0 ],
	magenta: [ 'CMYK', 0, 1, 0, 0 ],
	yellow: [ 'CMYK', 0, 0, 1, 0 ],
};

color.convert = function (c, colorspace) {
	switch (colorspace) {
	case 'G':
		if (c[0] === 'RGB')
			return [ 'G', c[1] * 0.3 + c[2] * 0.59 + c[3] * 0.11 ];
		if (c[0] === 'CMYK')
			return [ 'CMYK', 1 - Math.min(1, c[1] * 0.3 + c[2] * 0.59 + c[3] * 0.11 + c[4])];
		break;
	case 'RGB':
		if (c[0] === 'G')
			return [ 'RGB', c[1], c[1], c[1] ];
		if (c[0] === 'CMYK')
			return [ 'RGB',
				1 - Math.min(1, c[1] + c[4]),
				1 - Math.min(1, c[2] + c[4]),
				1 - Math.min(1, c[3] + c[4]) ];
		break;
	case 'CMYK':
		if (c[0] === 'G')
			return [ 'CMYK', 0, 0, 0, 1 - c[1] ];
		if (c[0] === 'RGB')
			return [ 'CMYK', 1 - c[1], 1 - c[2], 1 - c[3], 0 ];
		break;
	}
	return c;
}

color.equal = function (a, b) {
	var i, n
	if (a[0] === 'G')
		a = color.convert(a, b[0]);
	else
		b = color.convert(b, a[0]);
	if (a[0] !== b[0])
		return false;
	switch (a[0]) {
	case 'G': n = 1; break;
	case 'RGB': n = 3; break;
	case 'CMYK': n = 4; break;
	default: n = 0; break;
	}
	for (i = 1; i <= n; ++i)
		if (a[i] !== b[i])
			return false;
	return true;
}

var font = {
	Cour: 'Courier',
	CourB: 'Courier-Bold',
	CourBI: 'Courier-BoldOblique',
	CourI: 'Courier-Oblique',
	Helv: 'Helvetica',
	HelvB: 'Helvetica-Bold',
	HelvBI: 'Helvetica-BoldOblique',
	HelvI: 'Helvetica-Oblique',
	Symbol: 'Symbol',
	Times: 'Times-Roman',
	TimesB: 'Times-Bold',
	TimesBI: 'Times-BoldItalic',
	TimesI: 'Times-Italic',
	ZapfD: 'ZapfDingbats',
};

var highlight = {
	i: 'invert',
	n: 'none',
	o: 'outline',
	p: 'push',
};

var position = {
	textOnly: 0,
	iconOnly: 1,
	iconTextV: 2,
	textIconV: 3,
	iconTextH: 4,
	textIconH: 5,
	overlay: 6,
};

var scaleHow = {
	proportional: 0,
	anamorphic: 1,
};

var scaleWhen = {
	always: 0,
	never: 1,
	tooBig: 2,
	tooSmall: 3,
};

var style = {
	ch: 'check',
	ci: 'circle',
	cr: 'cross',
	di: 'diamond',
	sq: 'square',
	st: 'star',
};

var zoomtype = {
	fitH: 'FitHeight',
	fitP: 'FitPage',
	fitV: 'FitVisibleWidth',
	fitW: 'FitWidth',
	none: 'NoVary',
	pref: 'Preferred',
	refW: 'ReflowWidth',
};

function Util()
{
};

Util.prototype.scand = function (fmt, input) {
	// This seems to match Acrobat's parsing behavior
	return AFParseDateEx(input, fmt);
}

Util.prototype.printd = function (fmt, date) {
	var monthName = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	var dayName = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];
	if (fmt === 0)
		fmt = 'D:yyyymmddHHMMss';
	else if (fmt === 1)
		fmt = 'yyyy.mm.dd HH:MM:ss';
	else if (fmt === 2)
		fmt = 'm/d/yy h:MM:ss tt';
	if (!date)
		date = new Date();
	else if (!(date instanceof Date))
		date = new Date(date);
	var tokens = fmt.match(/(\\.|m+|d+|y+|H+|h+|M+|s+|t+|[^\\mdyHhMst]*)/g);
	var out = '';
	for (var i = 0; i < tokens.length; ++i) {
		var token = tokens[i];
		switch (token) {
		case 'mmmm': out += monthName[date.getMonth()]; break;
		case 'mmm': out += monthName[date.getMonth()].substring(0, 3); break;
		case 'mm': out += util.printf('%02d', date.getMonth()+1); break;
		case 'm': out += date.getMonth()+1; break;
		case 'dddd': out += dayName[date.getDay()]; break;
		case 'ddd': out += dayName[date.getDay()].substring(0, 3); break;
		case 'dd': out += util.printf('%02d', date.getDate()); break;
		case 'd': out += date.getDate(); break;
		case 'yyyy': out += date.getFullYear(); break;
		case 'yy': out += date.getFullYear() % 100; break;
		case 'HH': out += util.printf('%02d', date.getHours()); break;
		case 'H': out += date.getHours(); break;
		case 'hh': out += util.printf('%02d', (date.getHours()+11)%12+1); break;
		case 'h': out += (date.getHours() + 11) % 12 + 1; break;
		case 'MM': out += util.printf('%02d', date.getMinutes()); break;
		case 'M': out += date.getMinutes(); break;
		case 'ss': out += util.printf('%02d', date.getSeconds()); break;
		case 's': out += date.getSeconds(); break;
		case 'tt': out += date.getHours() < 12 ? 'am' : 'pm'; break;
		case 't': out += date.getHours() < 12 ? 'a' : 'p'; break;
		default: out += (token[0] == '\\') ? token[1] : token; break;
		}
	}
	return out;
}

Util.prototype.printx = function (fmt, val) {
	function toUpper(str) { return str.toUpperCase(); }
	function toLower(str) { return str.toLowerCase(); }
	function toSame(str) { return str; }
	var convertCase = toSame;
	var res = '';
	var i, m;
	var n = fmt ? fmt.length : 0;
	var vn = val ? val.length : 0;
	var cleaned = fmt ? fmt.replace(/[^A-Za-z0-9]/g, '').length : 0;
	
	if (fmt.indexOf('A') != -1 && cleaned != vn) {
		return '';
	}
	
	for (i = 0; i < n; ++i) {
		switch (fmt.charAt(i)) {
		case '\\':
			if (++i < n)
				res += fmt.charAt(i);
			break;
		case 'X':
			m = val.match(/\w/);
			if (m) {
				res += convertCase(m[0]);
				val = val.replace(/^\W*\w/, '');
			} else {
				res += ' ';
			}
			break;
		case 'A':
			m = val.match(/[A-Za-z]/);
			if (m) {
				res += convertCase(m[0]);
				val = val.replace(/^[^A-Za-z]*[A-Za-z]/, '');
			} else {
				res += ' ';
			}
			break;
		case '9':
			m = val.match(/\d/);
			if (m) {
				res += m[0];
				val = val.replace(/^\D*\d/, '');
			} else {
				res += ' ';
			}
			break;
		case '*':
			res += convertCase(val);
			val = '';
			break;
		case '?':
			if (val !== '') {
				res += convertCase(val.charAt(0));
				val = val.substring(1);
			}
			break;
		case '=':
			convertCase = toSame;
			break;
		case '>':
			convertCase = toUpper;
			break;
		case '<':
			convertCase = toLower;
			break;
		default:
			res += convertCase(fmt.charAt(i));
			break;
		}
	}
	return res;
}

/*Util.prototype.printx = function (fmt, val) {
	function toUpper(str) { return str.toUpperCase(); }
	function toLower(str) { return str.toLowerCase(); }
	function toSame(str) { return str; }
	var convertCase = toSame;
	var res = '';
	var i, m;
	var n = fmt ? fmt.length : 0;
	for (i = 0; i < n; ++i) {
		switch (fmt.charAt(i)) {
		case '\\':
			if (++i < n)
				res += fmt.charAt(i);
			break;
		case 'X':
			m = val.match(/\w/);
			if (m) {
				res += convertCase(m[0]);
				val = val.replace(/^\W*\w/, '');
			}
			break;
		case 'A':
			m = val.match(/[A-Za-z]/);
			if (m) {
				res += convertCase(m[0]);
				val = val.replace(/^[^A-Za-z]*[A-Za-z]/, '');
			}
			break;
		case '9':
			m = val.match(/\d/);
			if (m) {
				res += m[0];
				val = val.replace(/^\D*\d/, '');
			}
			break;
		case '*':
			res += convertCase(val);
			val = '';
			break;
		case '?':
			if (val !== '') {
				res += convertCase(val.charAt(0));
				val = val.substring(1);
			}
			break;
		case '=':
			convertCase = toSame;
			break;
		case '>':
			convertCase = toUpper;
			break;
		case '<':
			convertCase = toLower;
			break;
		default:
			res += convertCase(fmt.charAt(i));
			break;
		}
	}
	return res;
}*/

/*Util.prototype.printx = function (fmt, val) {
	debugger;
	function toUpper(str) { return str.toUpperCase(); }
	function toLower(str) { return str.toLowerCase(); }
	function toSame(str) { return str; }
	var convertCase = toSame;
	var res = '';
	var i, m;
	var n = fmt ? fmt.length : 0;
	var vn = val ? val.length : 0;
	
	/*if (n != vn) {
		return '';
	}
	
	for (i = 0; i < n; ++i) {
		switch (fmt.charAt(i)) {
		case '\\':
			if (++i < n)
				res += fmt.charAt(i);
			break;
		case 'X':
			m = val.match(/\w/);
			if (m) {
				res += convertCase(m[0]);
				val = val.replace(/^\W*\w/, '');
			} else {
				return '';
			}
			break;
		case 'A':
			m = val.match(/[A-Za-z]/);
			if (m) {
				res += convertCase(m[0]);
				val = val.replace(/^[^A-Za-z]*[A-Za-z]/, '');
			} else {
				return '';
			}
			break;
		case '9':
			m = val.match(/\d/);
			if (m) {
				res += m[0];
				val = val.replace(/^\D*\d/, '');
			} else {
				return '';
			}
			break;
		case '*':
			res += convertCase(val);
			val = '';
			break;
		case '?':
			if (val !== '') {
				res += convertCase(val.charAt(0));
				val = val.substring(1);
			}
			break;
		case '=':
			convertCase = toSame;
			break;
		case '>':
			convertCase = toUpper;
			break;
		case '<':
			convertCase = toLower;
			break;
		default:
			res += convertCase(fmt.charAt(i));
			break;
		}
	}
	return res;
}*/

Util.prototype.printf = function()
		{
			var ret = "";
			try 
			{
				// limit number of argument to less than 50 for now
				if (arguments.length < 50)
				{
					ret = sprintf.apply(this, arguments);
				}
			}
			catch(e) {}
			return ret;
		};

function AFMergeChange(event) {
	var prefix, postfix;
	var value = event.value;
	if (event.willCommit)
		return value;
	if (event.selStart >= 0)
		prefix = value.substring(0, event.selStart);
	else
		prefix = '';
	if (event.selEnd >= 0 && event.selEnd <= value.length)
		postfix = value.substring(event.selEnd, value.length);
	else
		postfix = '';
	return prefix + event.change + postfix;
}

function AFExtractNums(string) {
	if (string.charAt(0) == '.' || string.charAt(0) == ',')
		string = '0' + string;
	return string.match(/\d+/g);
}

function AFMakeNumber(string) {
	if (typeof string == 'number')
		return string;
	if (typeof string != 'string')
		return null;
	var nums = AFExtractNums(string);
	if (!nums)
		return null;
	var result = nums.join('.');
	if (string.indexOf('-.') >= 0)
		result = '0.' + result;
	if (string.indexOf('-') >= 0)
		return -result;
	return +result;
}

function AFExtractTime(string) {
	var pattern = /\d\d?:\d\d?(:\d\d?)?\s*(am|pm)?/i;
	var match = pattern.exec(string);
	if (match) {
		var prefix = string.substring(0, match.index);
		var suffix = string.substring(match.index + match[0].length);
		return [ prefix + suffix, match[0] ];
	}
	return null;
}

function AFParseDateOrder(fmt) {
	var order = '';
	fmt += 'mdy'; // Default order if any parts are missing.
	for (var i = 0; i < fmt.length; i++) {
		var c = fmt.charAt(i);
		if ((c == 'y' || c == 'm' || c == 'd') && order.indexOf(c) < 0)
			order += c;
	}
	return order;
}

function AFMatchMonth(date) {
	var names = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
	var month = date.match(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i);
	if (month)
		return names.indexOf(month[0].toLowerCase());
	return null;
}

function AFParseTime(string, date) {
	if (!date)
		date = new Date();
	if (!string)
		return date;
	var nums = AFExtractNums(string);
	if (!nums || nums.length < 2 || nums.length > 3)
		return null;
	var hour = nums[0];
	var min = nums[1];
	var sec = (nums.length == 3) ? nums[2] : 0;
	if (hour < 12 && (/pm/i).test(string))
		hour += 12;
	if (hour >= 12 && (/am/i).test(string))
		hour -= 12;
	date.setHours(hour, min, sec);
	if (date.getHours() != hour || date.getMinutes() != min || date.getSeconds() != sec)
		return null;
	return date;
}

function AFMakeDate(out, year, month, date, time)
{
	if (year < 50)
		year += 2000;
	if (year < 100)
		year += 1900;
	
	// out.setFullYear(year, month, date);
	out.setYear(year || 2020);
	out.setDate(date || 01);
	out.setMonth(month || 00);

	if ((year != '' && out.getFullYear() != year) || (month != '' && out.getMonth() != month) || (date != '' && out.getDate() != date))
		return null;
	if (time)
		out = AFParseTime(time, out);
	else
		out.setHours(0, 0, 0);
	return out;
}

function AFParseDateEx(string, fmt) {
	var out = new Date();
	var year = out.getFullYear();
	var month;
	var date;
	var i;

	out.setHours(12, 0, 0);

	var order = AFParseDateOrder(fmt);

	var time = AFExtractTime(string);
	if (time) {
		string = time[0];
		time = time[1];
	}

	var nums = AFExtractNums(string);
	if (!nums)
		return null;

	if (nums.length == 3) {
		year = nums[order.indexOf('y')];
		month = nums[order.indexOf('m')];
		date = nums[order.indexOf('d')];
		return AFMakeDate(out, year, month-1, date, time);
	}

	month = AFMatchMonth(string);

	if (nums.length == 2) {
		// We have a textual month.
		if (month) {
			if (order.indexOf('y') < order.indexOf('d')) {
				year = nums[0];
				date = nums[1];
			} else {
				year = nums[1];
				date = nums[0];
			}
		}

		// Year before date: set year and month.
		else if (order.indexOf('y') < order.indexOf('d')) {
			if (order.indexOf('y') < order.indexOf('m')) {
				year = nums[0];
				month = nums[1];
			} else {
				year = nums[1];
				month = nums[0];
			}
		}

		// Date before year: set date and month.
		else {
			if (order.indexOf('d') < order.indexOf('m')) {
				date = nums[0];
				month = nums[1];
			} else {
				date = nums[1];
				month = nums[0];
			}
		}

		return AFMakeDate(out, year, month-1, date, time);
	}

	if (nums.length == 1) {
		if (month) {
			if (order.indexOf('y') < order.indexOf('d')) {
				year = nums[0];
				date = 1;
			} else {
				date = nums[0];
			}
			return AFMakeDate(out, year, month-1, date, time);
		}

		// Only one number: must match format exactly!
		if (string.length == fmt.length) {
			year = month = date = '';
			for (i = 0; i < fmt.length; ++i) {
				switch (fmt.charAt(i)) {
				case '\\': ++i; break;
				case 'y': year += string.charAt(i); break;
				case 'm': month += string.charAt(i); break;
				case 'd': date += string.charAt(i); break;
				}
			}
			return AFMakeDate(out, year, month-1, date, time);
		}
	}

	return null;
}

var AFDate_oldFormats = [
	'm/d',
	'm/d/yy',
	'mm/dd/yy',
	'mm/yy',
	'd-mmm',
	'd-mmm-yy',
	'dd-mm-yy',
	'yy-mm-dd',
	'mmm-yy',
	'mmmm-yy',
	'mmm d, yyyy',
	'mmmm d, yyyy',
	'm/d/yy h:MM tt',
	'm/d/yy HH:MM'
];

function AFDate_KeystrokeEx(fmt) {
	if (event.willCommit && !AFParseDateEx(event.value, fmt)) {
		app.alert('The date/time entered ('+event.value+') does not match the format ('+fmt+') of the field [ '+event.target.name+' ]');
		event.rc = false;
	}
}

function AFDate_Keystroke(index) {
	AFDate_KeystrokeEx(AFDate_oldFormats[index]);
}

function AFDate_FormatEx(fmt) {
	var d = AFParseDateEx(event.value, fmt);
	event.value = d ? util.printd(fmt, d) : '';
}

function AFDate_Format(index) {
	AFDate_FormatEx(AFDate_oldFormats[index]);
}

function AFTime_Keystroke(index) {
	if (event.willCommit && !AFParseTime(event.value, null)) {
		app.alert('The value entered ('+event.value+') does not match the format of the field [ '+event.target.name+' ]');
		event.rc = false;
	}
}

function AFTime_FormatEx(fmt) {
	var d = AFParseTime(event.value, null);
	event.value = d ? util.printd(fmt, d) : '';
}

function AFTime_Format(index) {
	var formats = [ 'HH:MM', 'h:MM tt', 'HH:MM:ss', 'h:MM:ss tt' ];
	AFTime_FormatEx(formats[index]);
}

function AFSpecial_KeystrokeEx(fmt) {
	function toUpper(str) { return str.toUpperCase(); }
	function toLower(str) { return str.toLowerCase(); }
	function toSame(str) { return str; }
	var convertCase = toSame;
	var val = event.value;
	var res = '';
	var i = 0;
	var m;
	var length = fmt ? fmt.length : 0;
	while (i < length) {
		switch (fmt.charAt(i)) {
		case '\\':
			i++;
			if (i >= length)
				break;
			res += fmt.charAt(i);
			if (val && val.charAt(0) === fmt.charAt(i))
				val = val.substring(1);
			break;

		case 'X':
			m = val.match(/^\w/);
			if (!m) {
				event.rc = false;
				break;
			}
			res += convertCase(m[0]);
			val = val.substring(1);
			break;

		case 'A':
			m = val.match(/^[A-Za-z]/);
			if (!m) {
				event.rc = false;
				break;
			}
			res += convertCase(m[0]);
			val = val.substring(1);
			break;

		case '9':
			m = val.match(/^\d/);
			if (!m) {
				event.rc = false;
				break;
			}
			res += m[0];
			val = val.substring(1);
			break;

		case '*':
			res += convertCase(val);
			val = '';
			break;

		case '?':
			if (val === '') {
				event.rc = false;
				break;
			}
			res += convertCase(val.charAt(0));
			val = val.substring(1);
			break;

		case '=':
			convertCase = toSame;
			break;
		case '>':
			convertCase = toUpper;
			break;
		case '<':
			convertCase = toLower;
			break;

		default:
			res += fmt.charAt(i);
			if (val && val.charAt(0) === fmt.charAt(i))
				val = val.substring(1);
			break;
		}

		i++;
	}

	//  If there are characters left over in the value, it's not a match.
	if (val.length > 0)
		event.rc = false;

	if (event.rc)
		event.value = res;
	else if (event.willCommit)
		app.alert('The value entered ('+event.value+') does not match the format of the field [ '+event.target.name+' ] should be '+fmt);
}

function AFSpecial_Keystroke(index) {
	if (event.willCommit) {
		switch (index) {
		case 0:
			if (!event.value.match(/^\d{5}$/))
				event.rc = false;
			break;
		case 1:
			if (!event.value.match(/^\d{5}[-. ]?\d{4}$/))
				event.rc = false;
			break;
		case 2:
			if (!event.value.match(/^((\(\d{3}\)|\d{3})[-. ]?)?\d{3}[-. ]?\d{4}$/))
				event.rc = false;
			break;
		case 3:
			if (!event.value.match(/^\d{3}[-. ]?\d{2}[-. ]?\d{4}$/))
				event.rc = false;
			break;
		}
		if (!event.rc)
			app.alert('The value entered ('+event.value+') does not match the format of the field [ '+event.target.name+' ]');
	}
}

function AFSpecial_Format(index) {
	var res;
	switch (index) {
	case 0:
		res = util.printx('99999', event.value);
		break;
	case 1:
		res = util.printx('99999-9999', event.value);
		break;
	case 2:
		res = util.printx('9999999999', event.value);
		res = util.printx(res.length >= 10 ? '(999) 999-9999' : '999-9999', event.value);
		break;
	case 3:
		res = util.printx('999-99-9999', event.value);
		break;
	}
	event.value = res ? res : '';
}

function AFNumber_Keystroke(nDec, sepStyle, negStyle, currStyle, strCurrency, bCurrencyPrepend) {
	if (sepStyle & 2) {
		if (!event.value.match(/^[+-]?\d*[,.]?\d*$/))
			event.rc = false;
	} else {
		if (!event.value.match(/^[+-]?\d*\.?\d*$/))
			event.rc = false;
	}
	if (event.willCommit) {
		if (!event.value.match(/\d/))
			event.rc = false;
		if (!event.rc)
			app.alert('The value entered ('+event.value+') does not match the format of the field [ '+event.target.name+' ]');
	}
}

function AFNumber_Format(nDec, sepStyle, negStyle, currStyle, strCurrency, bCurrencyPrepend) {
	var value = AFMakeNumber(event.value);
	var fmt = '%' + sepStyle + '.' + nDec + 'f';
	if (value == null) {
		event.value = '';
		return;
	}
	if (bCurrencyPrepend)
		fmt = strCurrency + fmt;
	else
		fmt = fmt + strCurrency;
	if (value < 0) {
		/* negStyle: 0=MinusBlack, 1=Red, 2=ParensBlack, 3=ParensRed */
		value = Math.abs(value);
		if (negStyle == 2 || negStyle == 3)
			fmt = '(' + fmt + ')';
		else if (negStyle == 0)
			fmt = '-' + fmt;
		if (negStyle == 1 || negStyle == 3)
			event.target.textColor = color.red;
		else
			event.target.textColor = color.black;
	} else {
		event.target.textColor = color.black;
	}
	event.value = util.printf(fmt, value);
}

function AFPercent_Keystroke(nDec, sepStyle) {
	AFNumber_Keystroke(nDec, sepStyle, 0, 0, '', true);
}

function AFPercent_Format(nDec, sepStyle) {
	var val = AFMakeNumber(event.value);
	if (val == null) {
		event.value = '';
		return;
	}
	event.value = (val * 100) + '';
	AFNumber_Format(nDec, sepStyle, 0, 0, '%', false);
}

function AFSimple_Calculate(op, list) {
	var i, res;

	switch (op) {
	case 'SUM': res = 0; break;
	case 'PRD': res = 1; break;
	case 'AVG': res = 0; break;
	}

	if (typeof list === 'string')
		list = list.split(/ *, */);

	for (i = 0; i < list.length; i++) {
		var field = this.getField(list[i]);
		var value = Number(field.value);
		switch (op) {
		case 'SUM': res += value; break;
		case 'PRD': res *= value; break;
		case 'AVG': res += value; break;
		case 'MIN': if (i === 0 || value < res) res = value; break;
		case 'MAX': if (i === 0 || value > res) res = value; break;
		}
	}

	if (op === 'AVG')
		res /= list.length;

	event.value = res;
}

function AFRange_Validate(lowerCheck, lowerLimit, upperCheck, upperLimit) {
	if (upperCheck && event.value > upperLimit)
		event.rc = false;
	if (lowerCheck && event.value < lowerLimit)
		event.rc = false;
	if (!event.rc) {
		if (lowerCheck && upperCheck)
			app.alert(util.printf('The entered value ('+event.value+') must be greater than or equal to %s and less than or equal to %s', lowerLimit, upperLimit));
		else if (lowerCheck)
			app.alert(util.printf('The entered value ('+event.value+') must be greater than or equal to %s', lowerLimit));
		else
			app.alert(util.printf('The entered value ('+event.value+') must be less than or equal to %s', upperLimit));
	}
}


function registerUndefinedProperty(proto, name, extension)
{
	proto[extension] = function () {
        
    };
}


/* Compatibility ECMAScript functions */
String.prototype.substr = function (start, length) {
	if (start < 0)
		start = this.length + start;
	if (length === undefined)
		return this.substring(start, this.length);
	return this.substring(start, start + length);
}
Date.prototype.getYear = Date.prototype.getFullYear;
Date.prototype.setYear = Date.prototype.setFullYear;
Date.prototype.toGMTString = Date.prototype.toUTCString;

console.clear = function() { console.println('--- clear console ---\n'); };
console.show = function(){};
console.hide = function(){};

var util = new Util();

app.plugIns = [];
app.viewerType = 'Reader';
app.language = 'ENU';
app.viewerVersion = NaN;
app.execDialog = function () { return 'cancel'; }
