"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormFunctionality = void 0;

var _util = require("../shared/util");

var _annotation_layer_forms = require("./annotation_layer_forms");

const CSS_UNITS = 96.0 / 72.0;
let _workingViewport = null;
let _displayedFormElements = [];
let _postRenderHook = false;

function _createViewport(width, height, page, dpiRatio) {
  let actualWidth = page._pageInfo.view[2];
  let actualHeight = page._pageInfo.view[3];
  let scale;
  let viewport;

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

var FormFunctionality = function FormFunctionalityClosure() {
  function FormFunctionality() {}

  FormFunctionality.clearControlRendersById = function () {
    _annotation_layer_forms.AnnotationLayer.clearControlRendersById();
  };

  FormFunctionality.clearControlRendersByType = function () {
    _annotation_layer_forms.AnnotationLayer.clearControlRendersByType();
  };

  FormFunctionality.setPostRenderHook = function (hook) {
    _postRenderHook = hook;
  };

  FormFunctionality.setControlRenderClosureByType = function (closure, type) {
    _annotation_layer_forms.AnnotationLayer.setControlRenderClosureByType(closure, type);
  };

  FormFunctionality.setControlRenderClosureById = function (closure, id) {
    _annotation_layer_forms.AnnotationLayer.setControlRenderClosureById(closure, id);
  };

  FormFunctionality.setPostCreationTweak = function (postCallback) {
    if (postCallback) _assertValidControlTweak(postCallback);

    _annotation_layer_forms.AnnotationLayer.setPostCreationTweak(postCallback);
  };

  FormFunctionality.getFormValues = function () {
    return _annotation_layer_forms.AnnotationLayer.getValues();
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
      throw "at least one parameter must be specified as a number: width, height";
    }

    let viewport = _createViewport(width, height, page, 1.0);

    let pageHolder = document.createElement('div');
    pageHolder.style.width = viewport.width + 'px';
    pageHolder.style.height = viewport.height + 'px';
    target.appendChild(pageHolder);
    let targetScale = viewport.scale;

    _annotation_layer_forms.AnnotationLayer.setValues(values);

    let pdfPageView = new pdfjsViewer.PDFPageView({
      container: pageHolder,
      scale: targetScale / CSS_UNITS,
      defaultViewport: viewport,
      annotationLayerFactory: new pdfjsViewer.DefaultAnnotationLayerFactory(),
      renderInteractiveForms: true
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
      let y = 1;
      elements = _annotation_layer_forms.AnnotationLayer.returnFormElementsOnPage(annotations);
    });
    let y = 3;
    y = y + 3;
    return elements;
  };

  return FormFunctionality;
}();

exports.FormFunctionality = FormFunctionality;