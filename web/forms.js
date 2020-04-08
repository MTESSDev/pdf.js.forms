import { AnnotationLayer } from 'pdfjs-lib';
import { CSS_UNITS } from './ui_utils';
import { DefaultAnnotationLayerFactory } from './annotation_layer_builder.js';
import { DefaultTextLayerFactory } from './text_layer_builder.js';
import { PDFPageView } from './pdf_page_view';

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

let FormFunctionality = (function FormFunctionalityClosure() {
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
        if (postCallback) {
            _assertValidControlTweak(postCallback);
        }
        AnnotationLayer.setPostCreationTweak(postCallback);
    };

    FormFunctionality.getFormValues = function () {
        return AnnotationLayer.getValues();
    };

    FormFunctionality.javascriptEvent = function (element, eventData, typeCall) {
        try {
            let raw = 'var thisEmulator = new Field(document.getElementById(\'' + element.target.id + '\'));\r\n' + atob(eventData);

            HTMLInputElement.prototype.borderStyle = element.target.style.borderStyle;
            let val = element.target.value;

            if ((element.target.tagName.toLowerCase() === 'input' &&
                element.target.type.toLowerCase() === 'text') ||
                element.target.tagName.toLowerCase() === 'textarea') {
                    if (element.which !== 0) {
                        val += String.fromCharCode(element.which);
                    }
                    element.change = event.key;
                    element.selStart = element.target.selectionStart;
            }

            element.value = val;
            element.rc = true;
            /* if ('FocusEvent' in element.toString()) {
                KeyboardEvent.prototype.change = event.key;
                KeyboardEvent.prototype.selStart = element.target.selectionStart;
                KeyboardEvent.prototype.value = val;
            } else if ('KeyboardEvent' in element.toString()) {
                KeyboardEvent.prototype.change = event.key;
                KeyboardEvent.prototype.selStart = element.target.selectionStart;
                KeyboardEvent.prototype.value = val;
            } */

            // let thisEmulator = new Field(element.target);
            /* raw = raw.replace(/app\./g,
                'pdfjsAppEmulator.'); */
            raw = raw.replace(/this\./g, 'thisEmulator.');

            // raw += '\r\n var border = { s }';
            // eslint-disable-next-line no-eval
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

        } catch (error) {
            if (console) {
                console.info('Validating PDF field ' + element.target.name + ' failed.');
            }
            return true;
        }
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
        // if (postCreationTweak)
        //    postCreationTweak("PAGE", "page", pageHolder);
        target.appendChild(pageHolder);

        let targetScale = viewport.scale;

        AnnotationLayer.setValues(values);
        AnnotationLayer.setOptions(options);

        let pdfPageView = new PDFPageView({
            id: page.pageNumber,
            container: pageHolder,
            scale: targetScale / CSS_UNITS,
            defaultViewport: viewport,
            textLayerFactory: new DefaultTextLayerFactory(),
            annotationLayerFactory: new DefaultAnnotationLayerFactory(),
            renderInteractiveForms: (options.renderInteractiveForms || true),
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
