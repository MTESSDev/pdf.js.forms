"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormFunctionality = void 0;

var _pdf = require("../pdf");

var _ui_utils = require("./ui_utils");

var _annotation_layer_builder = require("./annotation_layer_builder.js");

var _pdf_page_view = require("./pdf_page_view");

let _workingViewport = null;
let _displayedFormElements = [];
let _postRenderHook = false;

function _createViewport(width, height, page, dpiRatio) {
  let actualWidth = page._pageInfo.view[2];
  let actualHeight = page._pageInfo.view[3];
  let scale;
  let viewport;

  if (typeof width === 'number' && typeof height !== 'number') {
    scale = width / actualWidth * dpiRatio;
    viewport = page.getViewport({
      scale
    });
    return viewport;
  }

  if (typeof width !== 'number' && typeof height === 'number') {
    scale = height / actualHeight * dpiRatio;
    viewport = page.getViewport({
      scale
    });
    return viewport;
  }

  if (typeof width === 'number' && typeof height === 'number') {
    scale = height / actualHeight;

    if (scale * actualWidth > width) {
      scale = width / actualWidth * dpiRatio;
      viewport = page.getViewport({
        scale
      });
      return viewport;
    }

    scale = scale * dpiRatio;
    viewport = page.getViewport({
      scale
    });
    return viewport;
  }

  viewport = page.getViewport({
    dpiRatio
  });
  return viewport;
}

function _getFormElementsForPage(page) {
  let intent = 'display';
  page.getAnnotations({
    intent: intent
  }).then(function (annotations) {});
}

function _assertValidControlTweak(closure) {
  if (typeof closure != 'function') {
    throw new Error('Passed item is not a function');
  }

  if (closure.length != 3) {
    throw new Error('Passed function must accept three arguments: fieldType, elementId and element');
  }

  let args = closure.toString().match(/^\s*function\s*(?:\w*\s*)?\((.*?)\)/);
  args = args ? args[1] ? args[1].trim().split(/\s*,\s*/) : [] : null;

  if (args[0] != 'fieldType' || args[1] != 'elementId' || args[2] != 'element') {
    throw new Error('Passed function must accept three arguments: fieldType, elementId and element');
  }
}

let FormFunctionality = function FormFunctionalityClosure() {
  function FormFunctionality() {}

  FormFunctionality.test = function () {
    console.log('hi');
  };

  FormFunctionality.clearControlRendersById = function () {
    _pdf.AnnotationLayer.clearControlRendersById();
  };

  FormFunctionality.clearControlRendersByType = function () {
    _pdf.AnnotationLayer.clearControlRendersByType();
  };

  FormFunctionality.setPostRenderHook = function (hook) {
    _postRenderHook = hook;
  };

  FormFunctionality.setControlRenderClosureByType = function (closure, type) {
    _pdf.AnnotationLayer.setControlRenderClosureByType(closure, type);
  };

  FormFunctionality.setControlRenderClosureById = function (closure, id) {
    _pdf.AnnotationLayer.setControlRenderClosureById(closure, id);
  };

  FormFunctionality.setPostCreationTweak = function (postCallback) {
    if (postCallback) {
      _assertValidControlTweak(postCallback);
    }

    _pdf.AnnotationLayer.setPostCreationTweak(postCallback);
  };

  FormFunctionality.getFormValues = function () {
    return _pdf.AnnotationLayer.getValues();
  };

  FormFunctionality.javascriptEvent = function (element, eventData, typeCall) {
    let raw = 'var thisEmulator = new Field(document.getElementById(\'' + element.target.id + '\'));\r\n' + atob(eventData);
    HTMLInputElement.prototype.borderStyle = element.target.style.borderStyle;
    let val = element.target.value;

    if (element.target.tagName === 'input' && element.target.type === 'text' || element.target.tagName === 'textarea') {
      if (element.which !== 0) {
        val += String.fromCharCode(element.which);
      }

      element.change = event.key;
      element.selStart = element.target.selectionStart;
    }

    element.value = val;
    element.rc = true;
    raw = raw.replace(/this\./g, 'thisEmulator.');
    eval(raw);

    if (typeCall === 'format') {
      if (element.value === '' && val !== '') {
        element.target.setAttribute('data-val-pdfformatvalid-valid', false);
      } else {
        element.target.setAttribute('data-val-pdfformatvalid-valid', true);
      }
    }

    if (element.rc) {
      element.target.style.borderStyle = element.target.borderStyle;
      return true;
    }

    element.preventDefault();
    return false;
  };

  FormFunctionality.render = function (width, height, page, target, values, options) {
    console.log('In render');

    if (typeof values != 'object') {
      values = {};
    }

    if (typeof options != 'object') {
      options = {};
    }

    if (typeof width != 'number' && typeof height != 'number') {
      throw 'at least one parameter must be specified as a number: width, height';
    }

    let viewport = _createViewport(width, height, page, 1.0);

    let pageHolder = document.createElement('div');
    pageHolder.style.width = viewport.width + 'px';
    pageHolder.style.height = viewport.height + 'px';
    target.appendChild(pageHolder);
    let targetScale = viewport.scale;

    _pdf.AnnotationLayer.setValues(values);

    _pdf.AnnotationLayer.setOptions(options);

    let pdfPageView = new _pdf_page_view.PDFPageView({
      container: pageHolder,
      scale: targetScale / _ui_utils.CSS_UNITS,
      defaultViewport: viewport,
      annotationLayerFactory: new _annotation_layer_builder.DefaultAnnotationLayerFactory(),
      renderInteractiveForms: options.renderInteractiveForms || true
    });
    pdfPageView.setPdfPage(page);
    _workingViewport = viewport;
    pdfPageView.draw().then(function () {
      if (_postRenderHook) {
        _postRenderHook();
      }
    });
  };

  FormFunctionality.returnFormElementsOnPage = async function (page) {
    let intent = 'display';
    let elements = [];
    let h = await page.getAnnotations(intent).then(function (annotations) {
      elements = _pdf.AnnotationLayer.returnFormElementsOnPage(annotations);
    });
    return elements;
  };

  return FormFunctionality;
}();

exports.FormFunctionality = FormFunctionality;