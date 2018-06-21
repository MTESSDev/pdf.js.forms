
'use strict';

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define('pdfjs/display/forms', ['exports', 'pdfjs/shared/util', 'pdfjs/shared/global'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports, require('../shared/util.js'),
      require('../shared/global.js'));
  } else {
    factory((root.pdfjsDisplayForms = {}), root.pdfjsSharedUtil,
      root.pdfjsSharedGlobal);
  }
}(this, function (exports, sharedUtil, sharedGlobal) {

var Util = sharedUtil.Util; // @IAG Replace PDFJS.Util calls with this
var createPromiseCapability = sharedUtil.createPromiseCapability; // Maybe implement promises later

var FormFunctionality = function FormFunctionalityClosure() {
    var containFontSize = false;
    var _tabIndex = 1;
    var defaultScaleFontSize = '80%';
    var defaultMultilineFontSize = '12';
    var genericClosureOverrides = {};
    var idClosureOverrides = {};
    var postCreationTweak = false;
    var formFields = {};
    var postRenderHook = false;
    var fieldTypes = {
        UNSUPPORTED: false,
        CHECK_BOX: 'CHECK_BOX',
        DROP_DOWN: 'DROP_DOWN',
        PUSH_BUTTON: 'PUSH_BUTTON',
        RADIO_BUTTON: 'RADIO_BUTTON',
        TEXT: 'TEXT'
    };
    function assertValidControlClosure(closure) {
        if (typeof closure != 'function') {
            throw "Passed item is not a function";
        }
        if (closure.length != 2) {
            throw 'Passed function must accept two arguments: itemProperties and viewport';
        }
        var args = closure.toString().match(/^\s*function\s+(?:\w*\s*)?\((.*?)\)/);
        args = args ? args[1] ? args[1].trim().split(/\s*,\s*/) : [] : null;
        if (args[0] != 'itemProperties' || args[1] != 'viewport') {
            throw 'Passed function must accept two arguments: itemProperties and viewport';
        }
    }
    function assertValidControlTweak(closure) {
        if (typeof closure != 'function') {
            throw "Passed item is not a function";
        }
        if (closure.length != 3) {
            throw 'Passed function must accept three arguments: fieldType, elementId and element';
        }
        var args = closure.toString().match(/^\s*function\s+(?:\w*\s*)?\((.*?)\)/);
        args = args ? args[1] ? args[1].trim().split(/\s*,\s*/) : [] : null;
        if (args[0] != 'fieldType' || args[1] != 'elementId' || args[2] != 'element') {
            throw 'Passed function must accept three arguments: fieldType, elementId and element';
        }
    }
    function _isSelectMultiple(element) {
        for (var i = 0, l = element.attributes.length; i < l; i++) {
            try {
                if (element.attributes[i].name == 'multiple')
                    return true;
            } catch (e) {
            }
        }
        return false;
    }
    function _createViewport(width, height, page, dpiRatio) {
        var actualWidth = page.pageInfo.view[2];
        var actualHeight = page.pageInfo.view[3];
        var scale;
        var viewport;
        if (typeof width == 'number' && typeof height != 'number') {
            scale = width / actualWidth;
            viewport = page.getViewport(scale * dpiRatio);
            return viewport;
        }
        if (typeof width != 'number' && typeof height == 'number') {
            scale = height / actualHeight;
            viewport = page.getViewport(scale * dpiRatio);
            return viewport;
        }
        if (typeof width == 'number' && typeof height == 'number') {
            scale = height / actualHeight;
            if (scale * actualWidth > width) {
                scale = width / actualWidth;
                viewport = page.getViewport(scale * dpiRatio);
                return viewport;
            }
            viewport = page.getViewport(scale * dpiRatio);
            return viewport;
        }
        viewport = page.getViewport(dpiRatio);
        return viewport;
    }
    function _extend(obj1, obj2) {
        var obj3 = {};
        for (var prop in obj1) {
            obj3[prop] = obj1[prop];
        }
        for (var prop in obj2) {
            if (typeof obj2[prop] != 'undefined') {
                obj3[prop] = obj2[prop];
            }
        }
        return obj3;
    }
    function _getFontSize(value, viewport) {
        try {
            if (typeof value == 'number') {
                if (value <= 0) {
                    if (Number(defaultScaleFontSize) != 0 && Number(defaultScaleFontSize) > 0) {
                        return _getFontSize(defaultScaleFontSize, viewport);
                    }
                    return '80%';
                }
                return String(Math.round(value * viewport.fontScale));
            }
            if (typeof value == 'string') {
                if (value.indexOf('%') != -1) {
                    return value;
                } else {
                    return String(Math.round(Number(value) * viewport.fontScale));
                }
            }
            return '80%';
        } catch (e) {
            return '80%';
        }
    }
    function _getBasicFieldProperties(item, viewport) {
        var prop = {
            id: item.fullName,
            originalName: item.originalName,
            tabindex: _tabIndex++,
            type: itemType(item),
            fieldFlags: item.fieldFlags
        };
        if (item.fullName.indexOf('.`') != -1) {
            prop.correctedId = item.fullName.substring(0, item.fullName.indexOf('.`'));
            prop.groupingId = item.fullName.substring(item.fullName.indexOf('.`') + 2);
            prop.isGroupMember = true;
        } else {
            prop.correctedId = item.fullName;
            prop.isGroupMember = false;
            prop.groupingId = 0;
        }
        try {
            if ('fontSize' in item) {
                if (typeof item.fontSize == 'number' || typeof item.fontSize == 'string') {
                    prop.fontSize = _getFontSize(item.fontSize, viewport);
                } else {
                    prop.fontSize = _getFontSize(defaultScaleFontSize, viewport);
                }
            } else {
                prop.fontSize = _getFontSize(defaultScaleFontSize, viewport);
            }
        } catch (e) {
            prop.fontSize = '60%';
        }
        switch (item.textAlignment) {
            case 0:
                prop.textAlignment = 'left';
                break;
            case 1:
                prop.textAlignment = 'center';
                break;
            case 2:
                prop.textAlignment = 'right';
                break;
            default:
                prop.textAlignment = 'left';
                break;
        }
        return prop;
    }
    function _getDisplayFieldProperties(item, viewport) {
        var fieldRect = viewport.convertToViewportRectangle(item.rect);
        var rect = Util.normalizeRect(fieldRect);
        return {
            x: Math.floor(rect[0]),
            y: Math.floor(rect[1]),
            width: Math.ceil(rect[2] - rect[0]) + .5,
            height: Math.ceil(rect[3] - rect[1]) + .5
        };
    }
    function _getCheckBoxProperties(item, viewport, values, basicData) {
        var selected = item.selected;
        var v = values[basicData.id];
        switch (typeof v) {
            case "string": {
                selected = item.options.indexOf(v) > 0;
                break;
            }
            case "boolean": {
                selected = v;
                break;
            }
        }
        return {
            options: item.options,
            selected: selected,
            readOnly: item.readOnly
        };
    }
    function _getPushButtonProperties(item, viewport, values, basicData) {
        return {};
    }
    function _getRadioButtonProperties(item, viewport, values, basicData) {
        var selected = item.selected;
        if (basicData.correctedId in values) {
            var v = values[basicData.correctedId];
            selected = item.options.indexOf(v) > 0;
        }
        return {
            options: item.options,
            selected: selected,
            readOnly: item.readOnly
        };
    }
    function _getTextProperties(item, viewport, values, basicData) {
        var value = item.fieldValue;
        if (item.correctedId in values) {
            value = values[item.correctedId];
        }
        else if (item.fullName in values) {
            value = values[item.fullName];
        }
        if (basicData.isGroupMember && basicData.groupingId!=0) {
            item.readOnly = true; // only first textbox in group is editable
        }
        return {
            value: value,
            multiLine: item.multiLine,
            password: item.password,
            fileUpload: item.fileUpload,
            richText: item.richText,
            readOnly: item.readOnly,
            maxlen: item.maxlen
        };
    }
    function _getDropDownProperties(item, viewport, values, basicData) {
        var value = item.fieldValue;
        if (item.correctedId in values) {
            value = values[item.correctedId];
        }
        else if (item.fullName in values) {
            value = values[item.fullName];
        }
        return {
            value: value,
            options: item.options,
            multiSelect: item.multiSelect,
            allowTextEntry: item.allowTextEntry,
            readOnly: item.readOnly
        };
    }
    function getFieldProperties(item, viewport, values) {
        var basicData = _getBasicFieldProperties(item, viewport);
        item.correctedId = basicData.correctedId; // place back. Simplifies some matters
        basicData = _extend(_getDisplayFieldProperties(item, viewport), basicData);
        if (basicData.fontSize.indexOf('%') != -1) {
            var percentage = basicData.fontSize.substring(0, basicData.fontSize.indexOf('%')) / 100;
            basicData.fontSize = Math.round(basicData.height * percentage);
            basicData.fontSizeControl = Math.round(basicData.height * percentage - Math.ceil(4 * viewport.scale));
        } else
        {
            basicData.fontSizeControl = basicData.fontSize;
        }
        switch (basicData.type) {
            case fieldTypes.CHECK_BOX:
                basicData = _extend(basicData, _getCheckBoxProperties(item, viewport, values, basicData));
                break;
            case fieldTypes.DROP_DOWN:
                basicData = _extend(basicData, _getDropDownProperties(item, viewport, values, basicData));
                break;
            case fieldTypes.PUSH_BUTTON:
                basicData = _extend(basicData, _getPushButtonProperties(item, viewport, values, basicData));
                break;
            case fieldTypes.RADIO_BUTTON:
                basicData = _extend(basicData, _getRadioButtonProperties(item, viewport, values, basicData));
                break;
            case fieldTypes.TEXT:
                basicData = _extend(basicData, _getTextProperties(item, viewport, values, basicData));
                break;
        }
        return basicData;
    }
    function getPositionContainer(itemProperties, viewport) {
        var containerDiv = document.createElement('div');
        containerDiv.style.left = itemProperties.x + 'px';
        containerDiv.style.top = itemProperties.y + 'px';
        containerDiv.style.width = Math.floor(itemProperties.width) + 'px';
        containerDiv.style.height = Math.floor(itemProperties.height) + 'px';
        containerDiv.style.fontSize = itemProperties.fontSize + 'px';
        containerDiv.style.textAlign = itemProperties.textAlignment;
        containerDiv.style.position = 'absolute';
        containerDiv.style.border = '0 none';
        return containerDiv;
    }
    var defaultCreationRoutines = {};
    defaultCreationRoutines[fieldTypes.CHECK_BOX] = function (itemProperties, viewport) {
        var control = document.createElement('input');
        control.type = 'checkbox';
        control.value = itemProperties.options[1];
        control.id = 'correctedId' in itemProperties ? itemProperties.correctedId : itemProperties.id;
        control.name = 'correctedId' in itemProperties ? itemProperties.correctedId : itemProperties.id;
        control.style.padding = '0';
        control.style.margin = '0';
        control.style.marginLeft = itemProperties.width / 2 - Math.ceil(4 * viewport.scale) + 'px';
        if (itemProperties.selected)
            control.checked = 'checked';
        if (itemProperties.readOnly)
            control.disabled = 'disabled';
        return control;
    };
    defaultCreationRoutines[fieldTypes.RADIO_BUTTON] = function (itemProperties, viewport) {
        var control = document.createElement('input');
        control.type = 'radio';
        control.value = itemProperties.options[1];
        control.id = itemProperties.correctedId + '.' + itemProperties.groupingId;
        control.name = itemProperties.correctedId;
        control.style.padding = '0';
        control.style.margin = '0';
        control.style.marginLeft = itemProperties.width / 2 - Math.ceil(4 * viewport.scale) + 'px';
        if (itemProperties.selected)
            control.checked = 'checked';
        if (itemProperties.readOnly)
            control.disabled = 'disabled';
        return control;
    };
    defaultCreationRoutines[fieldTypes.TEXT] = function (itemProperties, viewport) {
        var control;
        if (itemProperties.multiLine) {
            control = document.createElement('textarea');
            control.style.resize = "none";
        } else {
            control = document.createElement('input');
            if (itemProperties.fileUpload) {
                control.type = 'file';
            } else if (itemProperties.password) {
                control.type = 'password';
            } else {
                control.type = 'text';
            }
        }
        if (itemProperties.isGroupMember) {
            control.setAttribute('data-group',itemProperties.correctedId);
            control.setAttribute('data-group-slave',itemProperties.groupingId!="0"?1:0);
        }
        control.style.width = Math.floor(itemProperties.width - 3) + 'px';
        control.style.height = Math.floor(itemProperties.height) + 'px';
        control.style.textAlign = itemProperties.textAlignment;
        if (!itemProperties.multiLine) {
            if (containFontSize && Math.floor(itemProperties.fontSizeControl) >= Math.floor(itemProperties.height - 2)) {
                control.style.fontSize = Math.floor(itemProperties.height - 3) + 'px';
            } else {
                if (containFontSize) {
                    control.style.fontSize = itemProperties.fontSizeControl + 'px';
                } else {
                    control.style.fontSize = itemProperties.fontSize + 'px';
                }
            }
        } else {
            if (containFontSize) {
                control.style.fontSize = itemProperties.fontSizeControl + 'px';
            } else {
                control.style.fontSize = itemProperties.fontSize + 'px';
            }
        }
        control.style.padding = '0';
        control.style.margin = '0';
        control.style.border = '1px solid #E6E6E6';
        control.style.display = 'block';
        if (itemProperties.maxlen) {
            control.maxLength = itemProperties.maxlen;
        }
        if (itemProperties.readOnly) {
            control.readOnly = true;
            control.style.cursor = "not-allowed";
        }
        control.value = itemProperties.value;
        control.id = !itemProperties.isGroupMember || itemProperties.groupingId == 0 ? itemProperties.correctedId : itemProperties.id;
        control.name = itemProperties.correctedId;
        return control;
    };
    defaultCreationRoutines[fieldTypes.DROP_DOWN] = function (itemProperties, viewport) {
        var control = document.createElement('select');
        if (itemProperties.multiSelect)
            control.multiple = true;
        control.style.width = Math.floor(itemProperties.width - 3) + 'px';
        control.style.height = Math.floor(itemProperties.height) + 'px';
        control.style.textAlign = itemProperties.textAlignment;
        control.id = 'correctedId' in itemProperties ? itemProperties.correctedId : itemProperties.id;
        control.name = 'correctedId' in itemProperties ? itemProperties.correctedId : itemProperties.id;
        if (Math.floor(itemProperties.fontSizeControl) >= Math.floor(itemProperties.height - 2)) {
            control.style.fontSize = Math.floor(itemProperties.height - 3) + 'px';
        } else {
            control.style.fontSize = itemProperties.fontSizeControl + 'px';
        }
        control.style.border = '1px solid #E6E6E6';
        control.style.display = 'block';
        if (itemProperties.options) {
            for (var option in itemProperties.options) {
                var optionElement = document.createElement('option');
                optionElement.value = itemProperties.options[option]['value'];
                optionElement.innerHTML = itemProperties.options[option]['text'];
                if (typeof itemProperties.value == 'object') {
                } else if (itemProperties.value == itemProperties.options[option]['value']) {
                    optionElement.selected = true;
                }
                control.appendChild(optionElement);
            }
        }
        if (itemProperties.readOnly) {
            control.disabled = 'disabled';
            control.style.cursor = "not-allowed";
        }
        return control;
    };
    function itemType(item) {
        if (item.subtype == 'Widget') {
            switch (item.fieldType) {
                case 'Tx':
                    if (item.paperMetaData)
                        break;
                    return fieldTypes.TEXT;
                    break;
                case 'Btn':
                    if (item.fieldFlags & 32768 || item.fieldFlags & 49152) {
                        return fieldTypes.RADIO_BUTTON;
                    } else if (item.fieldFlags & 65536) {
                        return fieldTypes.PUSH_BUTTON;
                    } else
                    {
                        return fieldTypes.CHECK_BOX;
                    }
                    break;
                case 'Ch':
                    return fieldTypes.DROP_DOWN;
                    break;
            }
        }
        return fieldTypes.UNSUPPORTED;
    }
    function resetFormFields() {
        formFields = {
            'CHECK_BOX': {},
            'TEXT': {},
            'RADIO_BUTTON': {},
            'DROP_DOWN': {}
        };
    }
    function determineControlType(control) {
        var nodeName = control.nodeName.toLowerCase();
        if (nodeName == 'input') {
            switch (control.type.toLowerCase()) {
                case 'radio':
                    return fieldTypes.RADIO_BUTTON;
                case 'checkbox':
                    return fieldTypes.CHECK_BOX;
            }
        } else if (nodeName == 'textarea') {
            return fieldTypes.TEXT;
        } else if (nodeName == 'select') {
            return fieldTypes.DROP_DOWN;
        }
        return fieldTypes.TEXT;
    }
    function renderForm(div, page, viewport, values) {
        resetFormFields();
        page.getAnnotations().then(function (items) {
            items.forEach(function (item) {
                var fieldType = itemType(item);
                if (fieldType) {
                    var fieldData = getFieldProperties(item, viewport, values);
                    var creationRoutine = idClosureOverrides[fieldData.correctedId] || genericClosureOverrides[fieldType] || defaultCreationRoutines[fieldType];
                    var control = creationRoutine ? creationRoutine(fieldData, viewport) : undefined;
                    if (control) {
                        if (postCreationTweak)
                            postCreationTweak(fieldType, fieldData.correctedId, control);
                        var container = getPositionContainer(fieldData, viewport);
                        container.appendChild(control);
                        fieldType = determineControlType(control);
                        switch (fieldType) {
                            case fieldTypes.RADIO_BUTTON:
                                formFields[fieldType][fieldData.correctedId] = formFields[fieldType][fieldData.correctedId] || [];
                                formFields[fieldType][fieldData.correctedId].push(control);
                                break;
                            default:
                                if (fieldData.groupingId == 0) {
                                    formFields[fieldType][fieldData.correctedId] = control;
                                }
                                break;
                        }
                        div.appendChild(container);
var FormFunctionality = function FormFunctionalityClosure() {
    var containFontSize = false;
    var _tabIndex = 1;
    var defaultScaleFontSize = '80%';
    var defaultMultilineFontSize = '12';
    var genericClosureOverrides = {};
    var idClosureOverrides = {};
    var postCreationTweak = false;
    var formFields = {};
    var postRenderHook = false;
    var fieldTypes = {
        UNSUPPORTED: false,
        CHECK_BOX: 'CHECK_BOX',
        DROP_DOWN: 'DROP_DOWN',
        PUSH_BUTTON: 'PUSH_BUTTON',
        RADIO_BUTTON: 'RADIO_BUTTON',
        TEXT: 'TEXT'
    };
    function assertValidControlClosure(closure) {
        if (typeof closure != 'function') {
            throw "Passed item is not a function";
        }
        if (closure.length != 2) {
            throw 'Passed function must accept two arguments: itemProperties and viewport';
        }
        var args = closure.toString().match(/^\s*function\s+(?:\w*\s*)?\((.*?)\)/);
        args = args ? args[1] ? args[1].trim().split(/\s*,\s*/) : [] : null;
        if (args[0] != 'itemProperties' || args[1] != 'viewport') {
            throw 'Passed function must accept two arguments: itemProperties and viewport';
        }
    }
    function assertValidControlTweak(closure) {
        if (typeof closure != 'function') {
            throw "Passed item is not a function";
        }
        if (closure.length != 3) {
            throw 'Passed function must accept three arguments: fieldType, elementId and element';
        }
        var args = closure.toString().match(/^\s*function\s+(?:\w*\s*)?\((.*?)\)/);
        args = args ? args[1] ? args[1].trim().split(/\s*,\s*/) : [] : null;
        if (args[0] != 'fieldType' || args[1] != 'elementId' || args[2] != 'element') {
            throw 'Passed function must accept three arguments: fieldType, elementId and element';
        }
    }
    function _isSelectMultiple(element) {
        for (var i = 0, l = element.attributes.length; i < l; i++) {
            try {
                if (element.attributes[i].name == 'multiple')
                    return true;
            } catch (e) {
            }
        }
        return false;
    }
    function _createViewport(width, height, page, dpiRatio) {
        var actualWidth = page.pageInfo.view[2];
        var actualHeight = page.pageInfo.view[3];
        var scale;
        var viewport;
        if (typeof width == 'number' && typeof height != 'number') {
            scale = width / actualWidth;
            viewport = page.getViewport(scale * dpiRatio);
            return viewport;
        }
        if (typeof width != 'number' && typeof height == 'number') {
            scale = height / actualHeight;
            viewport = page.getViewport(scale * dpiRatio);
            return viewport;
        }
        if (typeof width == 'number' && typeof height == 'number') {
            scale = height / actualHeight;
            if (scale * actualWidth > width) {
                scale = width / actualWidth;
                viewport = page.getViewport(scale * dpiRatio);
                return viewport;
            }
            viewport = page.getViewport(scale * dpiRatio);
            return viewport;
        }
        viewport = page.getViewport(dpiRatio);
        return viewport;
    }
    function _extend(obj1, obj2) {
        var obj3 = {};
        for (var prop in obj1) {
            obj3[prop] = obj1[prop];
        }
        for (var prop in obj2) {
            if (typeof obj2[prop] != 'undefined') {
                obj3[prop] = obj2[prop];
            }
        }
        return obj3;
    }
    function _getFontSize(value, viewport) {
        try {
            if (typeof value == 'number') {
                if (value <= 0) {
                    if (Number(defaultScaleFontSize) != 0 && Number(defaultScaleFontSize) > 0) {
                        return _getFontSize(defaultScaleFontSize, viewport);
                    }
                    return '80%';
                }
                return String(Math.round(value * viewport.fontScale));
            }
            if (typeof value == 'string') {
                if (value.indexOf('%') != -1) {
                    return value;
                } else {
                    return String(Math.round(Number(value) * viewport.fontScale));
                }
            }
            return '80%';
        } catch (e) {
            return '80%';
        }
    }
    function _getBasicFieldProperties(item, viewport) {
        var prop = {
            id: item.fullName,
            originalName: item.originalName,
            tabindex: _tabIndex++,
            type: itemType(item),
            fieldFlags: item.fieldFlags
        };
        if (item.fullName.indexOf('.`') != -1) {
            prop.correctedId = item.fullName.substring(0, item.fullName.indexOf('.`'));
            prop.groupingId = item.fullName.substring(item.fullName.indexOf('.`') + 2);
            prop.isGroupMember = true;
        } else {
            prop.correctedId = item.fullName;
            prop.isGroupMember = false;
            prop.groupingId = 0;
        }
        try {
            if ('fontSize' in item) {
                if (typeof item.fontSize == 'number' || typeof item.fontSize == 'string') {
                    prop.fontSize = _getFontSize(item.fontSize, viewport);
                } else {
                    prop.fontSize = _getFontSize(defaultScaleFontSize, viewport);
                }
            } else {
                prop.fontSize = _getFontSize(defaultScaleFontSize, viewport);
            }
        } catch (e) {
            prop.fontSize = '60%';
        }
        switch (item.textAlignment) {
            case 0:
                prop.textAlignment = 'left';
                break;
            case 1:
                prop.textAlignment = 'center';
                break;
            case 2:
                prop.textAlignment = 'right';
                break;
            default:
                prop.textAlignment = 'left';
                break;
        }
        return prop;
    }
    function _getDisplayFieldProperties(item, viewport) {
        var fieldRect = viewport.convertToViewportRectangle(item.rect);
        var rect = Util.normalizeRect(fieldRect);
        return {
            x: Math.floor(rect[0]),
            y: Math.floor(rect[1]),
            width: Math.ceil(rect[2] - rect[0]) + .5,
            height: Math.ceil(rect[3] - rect[1]) + .5
        };
    }
    function _getCheckBoxProperties(item, viewport, values, basicData) {
        var selected = item.selected;
        var v = values[basicData.id];
        switch (typeof v) {
            case "string": {
                selected = item.options.indexOf(v) > 0;
                break;
            }
            case "boolean": {
                selected = v;
                break;
            }
        }
        return {
            options: item.options,
            selected: selected,
            readOnly: item.readOnly
        };
    }
    function _getPushButtonProperties(item, viewport, values, basicData) {
        return {};
    }
    function _getRadioButtonProperties(item, viewport, values, basicData) {
        var selected = item.selected;
        if (basicData.correctedId in values) {
            var v = values[basicData.correctedId];
            selected = item.options.indexOf(v) > 0;
        }
        return {
            options: item.options,
            selected: selected,
            readOnly: item.readOnly
        };
    }
    function _getTextProperties(item, viewport, values, basicData) {
        var value = item.fieldValue;
        if (item.correctedId in values) {
            value = values[item.correctedId];
        }
        else if (item.fullName in values) {
            value = values[item.fullName];
        }
        if (basicData.isGroupMember && basicData.groupingId!=0) {
            item.readOnly = true; // only first textbox in group is editable
        }
        return {
            value: value,
            multiLine: item.multiLine,
            password: item.password,
            fileUpload: item.fileUpload,
            richText: item.richText,
            readOnly: item.readOnly,
            maxlen: item.maxlen
        };
    }
    function _getDropDownProperties(item, viewport, values, basicData) {
        var value = item.fieldValue;
        if (item.correctedId in values) {
            value = values[item.correctedId];
        }
        else if (item.fullName in values) {
            value = values[item.fullName];
        }
        return {
            value: value,
            options: item.options,
            multiSelect: item.multiSelect,
            allowTextEntry: item.allowTextEntry,
            readOnly: item.readOnly
        };
    }
    function getFieldProperties(item, viewport, values) {
        var basicData = _getBasicFieldProperties(item, viewport);
        item.correctedId = basicData.correctedId; // place back. Simplifies some matters
        basicData = _extend(_getDisplayFieldProperties(item, viewport), basicData);
        if (basicData.fontSize.indexOf('%') != -1) {
            var percentage = basicData.fontSize.substring(0, basicData.fontSize.indexOf('%')) / 100;
            basicData.fontSize = Math.round(basicData.height * percentage);
            basicData.fontSizeControl = Math.round(basicData.height * percentage - Math.ceil(4 * viewport.scale));
        } else
        {
            basicData.fontSizeControl = basicData.fontSize;
        }
        switch (basicData.type) {
            case fieldTypes.CHECK_BOX:
                basicData = _extend(basicData, _getCheckBoxProperties(item, viewport, values, basicData));
                break;
            case fieldTypes.DROP_DOWN:
                basicData = _extend(basicData, _getDropDownProperties(item, viewport, values, basicData));
                break;
            case fieldTypes.PUSH_BUTTON:
                basicData = _extend(basicData, _getPushButtonProperties(item, viewport, values, basicData));
                break;
            case fieldTypes.RADIO_BUTTON:
                basicData = _extend(basicData, _getRadioButtonProperties(item, viewport, values, basicData));
                break;
            case fieldTypes.TEXT:
                basicData = _extend(basicData, _getTextProperties(item, viewport, values, basicData));
                break;
        }
        return basicData;
    }
    function getPositionContainer(itemProperties, viewport) {
        var containerDiv = document.createElement('div');
        containerDiv.style.left = itemProperties.x + 'px';
        containerDiv.style.top = itemProperties.y + 'px';
        containerDiv.style.width = Math.floor(itemProperties.width) + 'px';
        containerDiv.style.height = Math.floor(itemProperties.height) + 'px';
        containerDiv.style.fontSize = itemProperties.fontSize + 'px';
        containerDiv.style.textAlign = itemProperties.textAlignment;
        containerDiv.style.position = 'absolute';
        containerDiv.style.border = '0 none';
        return containerDiv;
    }
    var defaultCreationRoutines = {};
    defaultCreationRoutines[fieldTypes.CHECK_BOX] = function (itemProperties, viewport) {
        var control = document.createElement('input');
        control.type = 'checkbox';
        control.value = itemProperties.options[1];
        control.id = 'correctedId' in itemProperties ? itemProperties.correctedId : itemProperties.id;
        control.name = 'correctedId' in itemProperties ? itemProperties.correctedId : itemProperties.id;
        control.style.padding = '0';
        control.style.margin = '0';
        control.style.marginLeft = itemProperties.width / 2 - Math.ceil(4 * viewport.scale) + 'px';
        if (itemProperties.selected)
            control.checked = 'checked';
        if (itemProperties.readOnly)
            control.disabled = 'disabled';
        return control;
    };
    defaultCreationRoutines[fieldTypes.RADIO_BUTTON] = function (itemProperties, viewport) {
        var control = document.createElement('input');
        control.type = 'radio';
        control.value = itemProperties.options[1];
        control.id = itemProperties.correctedId + '.' + itemProperties.groupingId;
        control.name = itemProperties.correctedId;
        control.style.padding = '0';
        control.style.margin = '0';
        control.style.marginLeft = itemProperties.width / 2 - Math.ceil(4 * viewport.scale) + 'px';
        if (itemProperties.selected)
            control.checked = 'checked';
        if (itemProperties.readOnly)
            control.disabled = 'disabled';
        return control;
    };
    defaultCreationRoutines[fieldTypes.TEXT] = function (itemProperties, viewport) {
        var control;
        if (itemProperties.multiLine) {
            control = document.createElement('textarea');
            control.style.resize = "none";
        } else {
            control = document.createElement('input');
            if (itemProperties.fileUpload) {
                control.type = 'file';
            } else if (itemProperties.password) {
                control.type = 'password';
            } else {
                control.type = 'text';
            }
        }
        if (itemProperties.isGroupMember) {
            control.setAttribute('data-group',itemProperties.correctedId);
            control.setAttribute('data-group-slave',itemProperties.groupingId!="0"?1:0);
        }
        control.style.width = Math.floor(itemProperties.width - 3) + 'px';
        control.style.height = Math.floor(itemProperties.height) + 'px';
        control.style.textAlign = itemProperties.textAlignment;
        if (!itemProperties.multiLine) {
            if (containFontSize && Math.floor(itemProperties.fontSizeControl) >= Math.floor(itemProperties.height - 2)) {
                control.style.fontSize = Math.floor(itemProperties.height - 3) + 'px';
            } else {
                if (containFontSize) {
                    control.style.fontSize = itemProperties.fontSizeControl + 'px';
                } else {
                    control.style.fontSize = itemProperties.fontSize + 'px';
                }
            }
        } else {
            if (containFontSize) {
                control.style.fontSize = itemProperties.fontSizeControl + 'px';
            } else {
                control.style.fontSize = itemProperties.fontSize + 'px';
            }
        }
        control.style.padding = '0';
        control.style.margin = '0';
        control.style.border = '1px solid #E6E6E6';
        control.style.display = 'block';
        if (itemProperties.maxlen) {
            control.maxLength = itemProperties.maxlen;
        }
        if (itemProperties.readOnly) {
            control.readOnly = true;
            control.style.cursor = "not-allowed";
        }
        control.value = itemProperties.value;
        control.id = !itemProperties.isGroupMember || itemProperties.groupingId == 0 ? itemProperties.correctedId : itemProperties.id;
        control.name = itemProperties.correctedId;
        return control;
    };
    defaultCreationRoutines[fieldTypes.DROP_DOWN] = function (itemProperties, viewport) {
        var control = document.createElement('select');
        if (itemProperties.multiSelect)
            control.multiple = true;
        control.style.width = Math.floor(itemProperties.width - 3) + 'px';
        control.style.height = Math.floor(itemProperties.height) + 'px';
        control.style.textAlign = itemProperties.textAlignment;
        control.id = 'correctedId' in itemProperties ? itemProperties.correctedId : itemProperties.id;
        control.name = 'correctedId' in itemProperties ? itemProperties.correctedId : itemProperties.id;
        if (Math.floor(itemProperties.fontSizeControl) >= Math.floor(itemProperties.height - 2)) {
            control.style.fontSize = Math.floor(itemProperties.height - 3) + 'px';
        } else {
            control.style.fontSize = itemProperties.fontSizeControl + 'px';
        }
        control.style.border = '1px solid #E6E6E6';
        control.style.display = 'block';
        if (itemProperties.options) {
            for (var option in itemProperties.options) {
                var optionElement = document.createElement('option');
                optionElement.value = itemProperties.options[option]['value'];
                optionElement.innerHTML = itemProperties.options[option]['text'];
                if (typeof itemProperties.value == 'object') {
                } else if (itemProperties.value == itemProperties.options[option]['value']) {
                    optionElement.selected = true;
                }
                control.appendChild(optionElement);
            }
        }
        if (itemProperties.readOnly) {
            control.disabled = 'disabled';
            control.style.cursor = "not-allowed";
        }
        return control;
    };
    function itemType(item) {
        if (item.subtype == 'Widget') {
            switch (item.fieldType) {
                case 'Tx':
                    if (item.paperMetaData)
                        break;
                    return fieldTypes.TEXT;
                    break;
                case 'Btn':
                    if (item.fieldFlags & 32768 || item.fieldFlags & 49152) {
                        return fieldTypes.RADIO_BUTTON;
                    } else if (item.fieldFlags & 65536) {
                        return fieldTypes.PUSH_BUTTON;
                    } else
                    {
                        return fieldTypes.CHECK_BOX;
                    }
                    break;
                case 'Ch':
                    return fieldTypes.DROP_DOWN;
                    break;
            }
        }
        return fieldTypes.UNSUPPORTED;
    }
    function resetFormFields() {
        formFields = {
            'CHECK_BOX': {},
            'TEXT': {},
            'RADIO_BUTTON': {},
            'DROP_DOWN': {}
        };
    }
    function determineControlType(control) {
        var nodeName = control.nodeName.toLowerCase();
        if (nodeName == 'input') {
            switch (control.type.toLowerCase()) {
                case 'radio':
                    return fieldTypes.RADIO_BUTTON;
                case 'checkbox':
                    return fieldTypes.CHECK_BOX;
            }
        } else if (nodeName == 'textarea') {
            return fieldTypes.TEXT;
        } else if (nodeName == 'select') {
            return fieldTypes.DROP_DOWN;
        }
        return fieldTypes.TEXT;
    }
    function renderForm(div, page, viewport, values) {
        resetFormFields();
        page.getAnnotations().then(function (items) {
            items.forEach(function (item) {
                var fieldType = itemType(item);
                if (fieldType) {
                    var fieldData = getFieldProperties(item, viewport, values);
                    var creationRoutine = idClosureOverrides[fieldData.correctedId] || genericClosureOverrides[fieldType] || defaultCreationRoutines[fieldType];
                    var control = creationRoutine ? creationRoutine(fieldData, viewport) : undefined;
                    if (control) {
                        if (postCreationTweak)
                            postCreationTweak(fieldType, fieldData.correctedId, control);
                        var container = getPositionContainer(fieldData, viewport);
                        container.appendChild(control);
                        fieldType = determineControlType(control);
                        switch (fieldType) {
                            case fieldTypes.RADIO_BUTTON:
                                formFields[fieldType][fieldData.correctedId] = formFields[fieldType][fieldData.correctedId] || [];
                                formFields[fieldType][fieldData.correctedId].push(control);
                                break;
                            default:
                                if (fieldData.groupingId == 0) {
                                    formFields[fieldType][fieldData.correctedId] = control;
                                }
                                break;
                        }
                        div.appendChild(container);
                    }
                }
            });
            if (postRenderHook)
                postRenderHook();
        });
    }
    return {
        clearControlRendersById: function () {
            idClosureOverrides = {};
        },
        clearControlRendersByType: function () {
            genericClosureOverrides = {};
        },
        setPostRenderHook: function (hook) {
            postRenderHook = hook;
        },
        setControlRenderClosureByType: function (closure, type) {
            if (type != 'CHECK_BOX' && type != 'TEXT' && type != 'DROP_DOWN' && type != 'RADIO_BUTTON') {
                throw "type must be one of the following: CHECK_BOX, TEXT, DROP_DOWN, RADIO_BUTTON";
            }
            if (!closure) {
                try {
                    delete genericClosureOverrides[type];
                } catch (e) {
                }
            } else {
                assertValidControlClosure(closure);
                genericClosureOverrides[type] = closure;
            }
        },
        setControlRenderClosureById: function (closure, id) {
            if (!closure) {
                try {
                    delete idClosureOverrides[id];
                } catch (e) {
                }
            } else {
                assertValidControlClosure(closure);
                idClosureOverrides[id] = closure;
            }
        },
        setPostCreationTweak: function (postCallback) {
            if (postCallback)
                assertValidControlTweak(postCallback);
            postCreationTweak = postCallback;
        },
        getFormValues: function () {
            var values = {};
            var visitElements = function (set, action) {
                var elementIds = Object.keys(set);
                elementIds.forEach(function (elementId) {
                    var element = set[elementId];
                    if (element)
                        action(elementId, element);
                });
            };
            visitElements(formFields[fieldTypes.CHECK_BOX], function (elementId, element) {
                values[elementId] = element.checked ? true : false;
            });
            visitElements(formFields[fieldTypes.TEXT], function (elementId, element) {
                values[elementId] = element.value;
            });
            visitElements(formFields[fieldTypes.DROP_DOWN], function (elementId, element) {
                if (_isSelectMultiple(element)) {
                    var valueObject = {};
                    for (var i = 0; i < element.length; i++) {
                        if (element[i].selected) {
                            valueObject[element[i].value] = element[i].value;
                        }
                    }
                    values[elementId] = valueObject;
                } else {
                    values[elementId] = element.options[element.selectedIndex].value;
                }
            });
            visitElements(formFields[fieldTypes.RADIO_BUTTON], function (elementId, element) {
                element.some(function (r) {
                    if (r.checked)
                        values[elementId] = r.value;
                    return r.checked;
                });
            });
            return values;
        },
        render: function (width, height, page, target, doForm, values) {
            _tabIndex = 1;
            if (typeof doForm != 'boolean') {
                doForm = true;
            }
            if (typeof values != 'object') {
                values = {};
            }
            if (typeof width != 'number' && typeof height != 'number') {
                throw "at least one parameter must be specified as a number: width, height";
            }
            var viewport = _createViewport(width, height, page, 1.0);
            var pageHolder = document.createElement('div');
            pageHolder.style.width = viewport.width + 'px';
            pageHolder.style.height = viewport.height + 'px';
            if (postCreationTweak)
                postCreationTweak("PAGE", "page", pageHolder);
            target.appendChild(pageHolder);
            target.style.position = 'relative';
            var canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            pageHolder.appendChild(canvas);
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var context = canvas.getContext('2d');
            var devicePixelRatio = window.devicePixelRatio || 1;
            var backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
            var ratio = devicePixelRatio / backingStoreRatio;
            canvas.style.width = canvas.width + "px";
            canvas.style.height = canvas.height + "px";
            canvas.width = canvas.width * ratio;
            canvas.height = canvas.height * ratio;
            if (postCreationTweak)
                postCreationTweak("CANVAS", "canvas", canvas);
            var renderContext = {
                canvasContext: context,
                viewport: _createViewport(width, height, page, ratio),
                intent: doForm ? "display" : "print"
            };
            page.render(renderContext);
            if (doForm) {
                var formHolder = document.createElement('form');
                formHolder.style.position = 'absolute';
                formHolder.style.top = '0';
                formHolder.style.left = '0';
                formHolder.height = viewport.height;
                formHolder.width = viewport.width;
                if (postCreationTweak)
                    postCreationTweak("FORM", "form", formHolder);
                pageHolder.appendChild(formHolder);
                renderForm(formHolder, page, viewport, values);
            }
        },
        returnFormElementsOnPage: function (page) {
            var elements = [];
            page.getAnnotations().then(function (items) {
                items.forEach(function (item) {
                    var fieldType;
                    if ((fieldType = itemType(item)) != fieldTypes.UNSUPPORTED) {
						if (fieldType == fieldTypes.TEXT) {
							if (item.fullName.indexOf('.`') != -1) {
								var correctedId = item.fullName.substring(0, item.fullName.indexOf('.`'));
								var groupingId = item.fullName.substring(item.fullName.indexOf('.`') + 2);
								if (groupingId == 0 ) {
									elements.push(correctedId);
								}
								else {
									elements.push(item.fullName);
								}
							}
							else {
								elements.push(item.fullName);
							}
						}
						else {
							elements.push(item.fullName);
						}
                    }
                });
            });
            return elements;
        }
    };
}();
exports.FormFunctionality = FormFunctionality;
}));
