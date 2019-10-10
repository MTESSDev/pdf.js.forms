import { AnnotationLayer } from 'pdfjs-lib';
import { CSS_UNITS } from './ui_utils';
import { PDFPageView } from './pdf_page_view';
import { DefaultAnnotationLayerFactory } from './annotation_layer_builder.js';

let _workingViewport = null;
let _displayedFormElements = [];
let _postRenderHook = false;

function _createViewport(width, height, page, dpiRatio) {
    let actualWidth = page._pageInfo.view[2];
    let actualHeight = page._pageInfo.view[3];
    let scale;
    let viewport;
    if (typeof width === 'number' && typeof height !== 'number') {
        scale = (width / actualWidth) * dpiRatio;
        viewport = page.getViewport({ scale, });
        return viewport;
    }
    if (typeof width !== 'number' && typeof height === 'number') {
        scale = (height / actualHeight) * dpiRatio;
        viewport = page.getViewport({ scale, });
        return viewport;
    }
    if (typeof width === 'number' && typeof height === 'number') {
        scale = height / actualHeight;
        if (scale * actualWidth > width) {
            scale = (width / actualWidth) * dpiRatio;
            viewport = page.getViewport({ scale, });
            return viewport;
        }
        scale = scale * dpiRatio;
        viewport = page.getViewport({ scale, });
        return viewport;
    }
    viewport = page.getViewport({ dpiRatio, });
    return viewport;
}

function _getFormElementsForPage(page) {
    let intent = 'display';
    page.getAnnotations({
        intent: intent
    }).then(function (annotations) {

    });
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

var FormFunctionality = (function FormFunctionalityClosure() {
    function FormFunctionality() {}

    FormFunctionality.test = function () {
        console.log('hi');
    };

    FormFunctionality.clearControlRendersById = function () {
        AnnotationLayer.clearControlRendersById();
    };

    FormFunctionality.clearControlRendersByType = function () {
        AnnotationLayer.clearControlRendersByType();
    };

    FormFunctionality.setPostRenderHook = function (hook) {
        _postRenderHook = hook;
    };

    FormFunctionality.setControlRenderClosureByType = function (closure, type) {
        AnnotationLayer.setControlRenderClosureByType(closure, type);
    };

    FormFunctionality.setControlRenderClosureById = function (closure, id) {
        AnnotationLayer.setControlRenderClosureById(closure, id);
    };

    FormFunctionality.setPostCreationTweak = function (postCallback) {
        if (postCallback)
            _assertValidControlTweak(postCallback);
        AnnotationLayer.setPostCreationTweak(postCallback);
    };

    FormFunctionality.getFormValues = function () {
        return AnnotationLayer.getValues();
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
        //if (postCreationTweak)
        //    postCreationTweak("PAGE", "page", pageHolder);
        target.appendChild(pageHolder);

        let targetScale = viewport.scale;

        AnnotationLayer.setValues(values);

        let pdfPageView = new PDFPageView({
            container: pageHolder,
            scale: targetScale / CSS_UNITS,
            defaultViewport: viewport,
            annotationLayerFactory:
                new DefaultAnnotationLayerFactory(),
            renderInteractiveForms: true,
        });

        // Associate the actual page with the view and draw it.
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
            elements = AnnotationLayer.returnFormElementsOnPage(annotations);
        });
        return elements;
    };

    return FormFunctionality;
})();

export {
    FormFunctionality,
};
