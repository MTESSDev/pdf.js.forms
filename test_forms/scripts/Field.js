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
		var boolVal = (_val=='Off' ? false : true);
		
			if(this.field.checked !== boolVal)
			{
				this.field.checked = (_val=='Off' ? false : true);
				if ("createEvent" in document) {
				    var evt = document.createEvent("HTMLEvents");
				    evt.initEvent("change", false, true);
				    this.field.dispatchEvent(evt);
				}
			}
			
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