/* Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint no-var: error */

import {
  addLinkAttributes, DOMSVGFactory, getFilenameFromUrl, LinkTarget,
  PDFDateString
} from './display_utils';
import {
    AnnotationBorderStyleType, AnnotationType, stringToPDFString,
    unreachable, Util, warn
} from '../shared/util';

let _tabIndex = 1;
let _formValues = [];
let _formOptions = [];
let _formFields = {
    'CHECK_BOX': {},
    'TEXT': {},
    'RADIO_BUTTON': {},
    'DROP_DOWN': {},
};
let fieldTypes = {
    UNSUPPORTED: false,
    CHECK_BOX: 'CHECK_BOX',
    DROP_DOWN: 'DROP_DOWN',
    PUSH_BUTTON: 'PUSH_BUTTON',
    RADIO_BUTTON: 'RADIO_BUTTON',
    TEXT: 'TEXT',
};

let genericClosureOverrides = {};
let idClosureOverrides = {};
let _postCreationTweak = false;

/**
 * @typedef {Object} AnnotationElementParameters
 * @property {Object} data
 * @property {HTMLDivElement} layer
 * @property {PDFPage} page
 * @property {PageViewport} viewport
 * @property {IPDFLinkService} linkService
 * @property {DownloadManager} downloadManager
 * @property {string} imageResourcesPath - (optional) Path for image resources,
 *   mainly for annotation icons. Include trailing slash.
 * @property {boolean} renderInteractiveForms
 * @property {Object} svgFactory
 */

class AnnotationElementFactory {

    static correctProps(annotation) {
        annotation.tabindex = _tabIndex++;
        annotation.id = annotation.fullName;

        if (annotation.fullName.indexOf('.`') != -1) {
            annotation.correctedId = annotation.fullName.substring(0, annotation.fullName.indexOf('.`'));
            annotation.groupingId = annotation.fullName.substring(annotation.fullName.indexOf('.`') + 2);
            annotation.isGroupMember = true;
        } else {
            annotation.correctedId = annotation.fullName;
            annotation.isGroupMember = false;
            annotation.groupingId = 0;
        }

        return annotation;
    }

    /**
     * @param {AnnotationElementParameters} parameters
     * @returns {AnnotationElement}
     */
    static create(parameters) {
    const subtype = parameters.data.annotationType;

        switch (subtype) {
            case AnnotationType.LINK:
                return new LinkAnnotationElement(parameters);

            case AnnotationType.TEXT:
                return new TextAnnotationElement(parameters);

            case AnnotationType.WIDGET:
                const fieldType = parameters.data.fieldType;
                parameters.data = AnnotationElementFactory.correctProps(parameters.data);

                switch (fieldType) {
                    case 'Tx':
                        return new TextWidgetAnnotationElement(parameters);
                    case 'Btn':
                        if (parameters.data.radioButton) {
                            return new RadioButtonWidgetAnnotationElement(parameters);
                        } else if (parameters.data.checkBox) {
                            return new CheckboxWidgetAnnotationElement(parameters);
                        }
                        return new PushButtonWidgetAnnotationElement(parameters);
                    case 'Ch':
                        return new ChoiceWidgetAnnotationElement(parameters);
                }
                return new WidgetAnnotationElement(parameters);

            case AnnotationType.POPUP:
                return new PopupAnnotationElement(parameters);

      case AnnotationType.FREETEXT:
        return new FreeTextAnnotationElement(parameters);

            case AnnotationType.LINE:
                return new LineAnnotationElement(parameters);

            case AnnotationType.SQUARE:
                return new SquareAnnotationElement(parameters);

            case AnnotationType.CIRCLE:
                return new CircleAnnotationElement(parameters);

            case AnnotationType.POLYLINE:
                return new PolylineAnnotationElement(parameters);

      case AnnotationType.CARET:
        return new CaretAnnotationElement(parameters);

            case AnnotationType.INK:
                return new InkAnnotationElement(parameters);

            case AnnotationType.POLYGON:
                return new PolygonAnnotationElement(parameters);

            case AnnotationType.HIGHLIGHT:
                return new HighlightAnnotationElement(parameters);

            case AnnotationType.UNDERLINE:
                return new UnderlineAnnotationElement(parameters);

            case AnnotationType.SQUIGGLY:
                return new SquigglyAnnotationElement(parameters);

            case AnnotationType.STRIKEOUT:
                return new StrikeOutAnnotationElement(parameters);

            case AnnotationType.STAMP:
                return new StampAnnotationElement(parameters);

            case AnnotationType.FILEATTACHMENT:
                return new FileAttachmentAnnotationElement(parameters);

            default:
                return new AnnotationElement(parameters);
        }
    }
}

class AnnotationElement {
    constructor(parameters, isRenderable = false, ignoreBorder = false) {
        this.isRenderable = isRenderable;
        this.data = parameters.data;
        this.layer = parameters.layer;
        this.page = parameters.page;
        this.viewport = parameters.viewport;
        this.linkService = parameters.linkService;
        this.downloadManager = parameters.downloadManager;
        this.imageResourcesPath = parameters.imageResourcesPath;
        this.renderInteractiveForms = parameters.renderInteractiveForms;
        this.svgFactory = parameters.svgFactory;

        if (isRenderable) {
            this.container = this._createContainer(ignoreBorder);
        }
    }

    /**
     * Create an empty container for the annotation's HTML element.
     *
     * @private
     * @param {boolean} ignoreBorder
     * @memberof AnnotationElement
     * @returns {HTMLSectionElement}
     */
    _createContainer(ignoreBorder = false) {
    const data = this.data, page = this.page, viewport = this.viewport;
    const container = document.createElement('section');
        let width = data.rect[2] - data.rect[0];
        let height = data.rect[3] - data.rect[1];

        container.setAttribute('data-annotation-id', data.id);

        // Do *not* modify `data.rect`, since that will corrupt the annotation
        // position on subsequent calls to `_createContainer` (see issue 6804).
    const rect = Util.normalizeRect([
            data.rect[0],
            page.view[3] - data.rect[1] + page.view[1],
            data.rect[2],
            page.view[3] - data.rect[3] + page.view[1]
        ]);

    container.style.transform = `matrix(${viewport.transform.join(',')})`;


        if (!ignoreBorder && data.borderStyle.width > 0) {
      container.style.borderWidth = `${data.borderStyle.width}px`;
            if (data.borderStyle.style !== AnnotationBorderStyleType.UNDERLINE) {
                // Underline styles only have a bottom border, so we do not need
                // to adjust for all borders. This yields a similar result as
                // Adobe Acrobat/Reader.
                width = width - 2 * data.borderStyle.width;
                height = height - 2 * data.borderStyle.width;
            }

      const horizontalRadius = data.borderStyle.horizontalCornerRadius;
      const verticalRadius = data.borderStyle.verticalCornerRadius;
            if (horizontalRadius > 0 || verticalRadius > 0) {
        const radius = `${horizontalRadius}px / ${verticalRadius}px`;
                container.style.borderRadius = radius;
            }

            switch (data.borderStyle.style) {
                case AnnotationBorderStyleType.SOLID:
                    container.style.borderStyle = 'solid';
                    break;

                case AnnotationBorderStyleType.DASHED:
                    container.style.borderStyle = 'dashed';
                    break;

                case AnnotationBorderStyleType.BEVELED:
                    warn('Unimplemented border style: beveled');
                    break;

                case AnnotationBorderStyleType.INSET:
                    warn('Unimplemented border style: inset');
                    break;

                case AnnotationBorderStyleType.UNDERLINE:
                    container.style.borderBottomStyle = 'solid';
                    break;

                default:
                    break;
            }

            if (data.color) {
                container.style.backgroundColor = Util.makeCssRgb(data.color[0] | 0,
                    data.color[1] | 0,
                    data.color[2] | 0);
            }

            if (data.borderStyle.borderColor) {
                container.style.borderColor = Util.makeCssRgb(data.borderStyle.borderColor[0] | 0,
                    data.borderStyle.borderColor[1] | 0,
                    data.borderStyle.borderColor[2] | 0);
            } else {
                // Transparent (invisible) border, so do not draw it at all.
                container.style.borderWidth = 0;
            }
        } /* else if (ignoreBorder && data.borderStyle.width > 0) {
            // Adjust position if no border draw
            // rect[0] += data.borderStyle.width;
            // rect[1] += data.borderStyle.width;
            //width += data.borderStyle.width * 2;
            //height += data.borderStyle.width * 2;
        } */

        container.style.transformOrigin = `-${rect[0]}px -${rect[1]}px`;
        container.style.left = `${rect[0]}px`;
        container.style.top = `${rect[1]}px`;
        container.style.width = `${width}px`;
        container.style.height = `${height}px`;
        return container;
    }

    /**
     * Create a popup for the annotation's HTML element. This is used for
     * annotations that do not have a Popup entry in the dictionary, but
     * are of a type that works with popups (such as Highlight annotations).
     *
     * @private
     * @param {HTMLSectionElement} container
     * @param {HTMLDivElement|HTMLImageElement|null} trigger
     * @param {Object} data
     * @memberof AnnotationElement
     */
    _createPopup(container, trigger, data) {
        // If no trigger element is specified, create it.
        if (!trigger) {
            trigger = document.createElement('div');
            trigger.style.height = container.style.height;
            trigger.style.width = container.style.width;
            container.appendChild(trigger);
        }

    const popupElement = new PopupElement({
            container,
            trigger,
            color: data.color,
            title: data.title,
      modificationDate: data.modificationDate,
            contents: data.contents,
            hideWrapper: true,
        });
    const popup = popupElement.render();

        // Position the popup next to the annotation's container.
        popup.style.left = container.style.width;

        container.appendChild(popup);
    }

    getCorrectedId() {
        return this.data.correctedId;
    }

    getGroupingId() {
        return this.data.groupingId;
    }

    /**
     * Render the annotation's HTML element in the empty container.
     *
     * @public
     * @memberof AnnotationElement
     */
    render() {
        unreachable('Abstract method `AnnotationElement.render` called');
    }
}

class LinkAnnotationElement extends AnnotationElement {
    constructor(parameters) {
    const isRenderable = !!(parameters.data.url || parameters.data.dest ||
            parameters.data.action);
        super(parameters, isRenderable);
    }

    /**
     * Render the link annotation's HTML element in the empty container.
     *
     * @public
     * @memberof LinkAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = 'linkAnnotation';

    const { data, linkService, } = this;
    const link = document.createElement('a');

    if (data.url) {
      addLinkAttributes(link, {
        url: data.url,
        target: (data.newWindow ?
                 LinkTarget.BLANK : linkService.externalLinkTarget),
        rel: linkService.externalLinkRel,
        enabled: linkService.externalLinkEnabled,
      });
    } else if (data.action) {
      this._bindNamedAction(link, data.action);
    } else {
      this._bindLink(link, data.dest);
    }

        this.container.appendChild(link);
        return this.container;
    }

    /**
     * Bind internal links to the link element.
     *
     * @private
     * @param {Object} link
     * @param {Object} destination
     * @memberof LinkAnnotationElement
     */
    _bindLink(link, destination) {
        link.href = this.linkService.getDestinationHash(destination);
        link.onclick = () => {
            if (destination) {
                this.linkService.navigateTo(destination);
            }
            return false;
        };
        if (destination) {
            link.className = 'internalLink';
        }
    }

    /**
     * Bind named actions to the link element.
     *
     * @private
     * @param {Object} link
     * @param {Object} action
     * @memberof LinkAnnotationElement
     */
    _bindNamedAction(link, action) {
        link.href = this.linkService.getAnchorUrl('');
        link.onclick = () => {
            this.linkService.executeNamedAction(action);
            return false;
        };
        link.className = 'internalLink';
    }
}

class TextAnnotationElement extends AnnotationElement {
    constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup ||
            parameters.data.title || parameters.data.contents);
        super(parameters, isRenderable);
    }

    /**
     * Render the text annotation's HTML element in the empty container.
     *
     * @public
     * @memberof TextAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = 'textAnnotation';

    const image = document.createElement('img');
        image.style.height = this.container.style.height;
        image.style.width = this.container.style.width;
        image.src = this.imageResourcesPath + 'annotation-' +
            this.data.name.toLowerCase() + '.svg';
        image.alt = '[{{type}} Annotation]';
        image.dataset.l10nId = 'text_annotation_type';
        image.dataset.l10nArgs = JSON.stringify({ type: this.data.name, });

        if (!this.data.hasPopup) {
            this._createPopup(this.container, image, this.data);
        }

        this.container.appendChild(image);
        return this.container;
    }
}

class WidgetAnnotationElement extends AnnotationElement {
    /**
     * Render the widget annotation's HTML element in the empty container.
     *
     * @public
     * @memberof WidgetAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        // Show only the container for unsupported field types.
        return this.container;
    }
}

class TextWidgetAnnotationElement extends WidgetAnnotationElement {
    constructor(parameters) {
    const isRenderable = parameters.renderInteractiveForms ||
            (!parameters.data.hasAppearance && !!parameters.data.fieldValue);
        super(parameters, isRenderable);
    }

    /**
     * Render the text widget annotation's HTML element in the empty container.
     *
     * @public
     * @memberof TextWidgetAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        const TEXT_ALIGNMENT = ['left', 'center', 'right'];

        this.container.className = 'textWidgetAnnotation';

        let element = null;
        let outDiv = null;
        if (this.renderInteractiveForms) {
            let creationRoutine = idClosureOverrides[this.data.correctedId] || genericClosureOverrides[fieldTypes.TEXT] || false;
            if (creationRoutine !== false) {
                element = creationRoutine(this);
            } else {
                let value = this.data.fieldValue;
                if (this.data.correctedId in _formValues) {
                    value = _formValues[this.data.correctedId];
                } else if (this.data.fullName in _formValues) {
                    value = _formValues[this.data.fullName];
                }
                this.data.value = value;
                if (this.data.isGroupMember && this.data.groupingId !== 0) {
                    this.data.readOnly = true; // only first textbox in group is editable
                }

                // NOTE: We cannot set the values using `element.value` below, since it
                //       prevents the AnnotationLayer rasterizer in `test/driver.js`
                //       from parsing the elements correctly for the reference tests.
                if (this.data.multiLine) {
                    element = document.createElement('textarea');
                    element.textContent = value;
                    element.style.resize = 'none';
                } else {
                    element = document.createElement('input');
                    if (this.data.fileUpload) {
                        element.type = 'file';
                    } else if (this.data.password) {
                        element.type = 'password';
                    } else {
                        element.type = 'text';
                    }
                    element.setAttribute('value', this.data.value);
                }
                if (this.data.isGroupMember) {
                    element.setAttribute('data-group', this.data.correctedId);
                    element.setAttribute('data-group-slave', this.data.groupingId !== '0' ? 1 : 0);
                }

                element.disabled = this.data.readOnly;
                if (this.data.readOnly) {
                    element.style.cursor = 'not-allowed';
                }

                if (this.data.doNotScroll) {
                    element.setAttribute('data-no-scroll', 'true');
                }

                if (this.data.maxLen !== null) {
                    element.maxLength = this.data.maxLen;
                }

                element.id = !this.data.isGroupMember || this.data.groupingId == 0 ? this.data.correctedId : this.data.id;
                element.name = this.data.correctedId;
                element.title = this.data.alternativeText;

                if (this.data.comb) {
                    const fieldWidth = this.data.rect[2] - this.data.rect[0];
                    const combWidth = fieldWidth / this.data.maxLen;

                    element.classList.add('comb');
                    element.style.letterSpacing = `calc(${combWidth}px - 1ch)`;
                }

                outDiv = AnnotationLayer.addJSActions(element, this.data, this.container, this.data.rect[3] - this.data.rect[1]);

                if (_postCreationTweak) {
                    _postCreationTweak(fieldTypes.TEXT, this.data, element);
                }
            }
        } else {
            element = document.createElement('div');
            element.textContent = this.data.fieldValue;
            element.style.verticalAlign = 'middle';
            element.style.display = 'table-cell';

            let font = null;
            if (this.data.fontRefName &&
                this.page.commonObjs.has(this.data.fontRefName)) {
                font = this.page.commonObjs.get(this.data.fontRefName);
            }
            this._setTextStyle(element, font);
        }

        if (this.data.textAlignment !== null) {
            element.style.textAlign = TEXT_ALIGNMENT[this.data.textAlignment];
        }

        this.container.appendChild(element);

        if (outDiv.errorDiv) {
            this.container.appendChild(outDiv.errorDiv);
        }
        if (outDiv.iconDiv) {
            this.container.appendChild(outDiv.iconDiv);
        }

        return this.container;
    }

    /**
     * Apply text styles to the text in the element.
     *
     * @private
     * @param {HTMLDivElement} element
     * @param {Object} font
     * @memberof TextWidgetAnnotationElement
     */
    _setTextStyle(element, font) {
        // TODO: This duplicates some of the logic in CanvasGraphics.setFont().
        const style = element.style;
        style.fontSize = `${this.data.fontSize}px`;
        style.direction = (this.data.fontDirection < 0 ? 'rtl' : 'ltr');

        if (!font) {
            return;
        }

        style.fontWeight = (font.black ?
            (font.bold ? '900' : 'bold') :
            (font.bold ? 'bold' : 'normal'));
        style.fontStyle = (font.italic ? 'italic' : 'normal');

        // Use a reasonable default font if the font doesn't specify a fallback.
        const fontFamily = font.loadedName ? `"${font.loadedName}", ` : '';
        const fallbackName = font.fallbackName || 'Helvetica, sans-serif';
        style.fontFamily = fontFamily + fallbackName;
    }
}

class CheckboxWidgetAnnotationElement extends WidgetAnnotationElement {
    constructor(parameters) {
        super(parameters, parameters.renderInteractiveForms, parameters.ignoreBorder);
    }

    /**
     * Render the checkbox widget annotation's HTML element
     * in the empty container.
     *
     * @public
     * @memberof CheckboxWidgetAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = 'buttonWidgetAnnotation checkBox';
        let creationRoutine = idClosureOverrides[this.data.correctedId] || genericClosureOverrides[fieldTypes.TEXT] || false;
        let element = null;
        let outDiv = null;
        if (creationRoutine !== false) {
            element = creationRoutine(this);
        } else {
            element = document.createElement('input');
            element.disabled = this.data.readOnly;
            element.type = 'checkbox';

            let selected = false;

            if (this.data.fieldValue &&
                 this.data.fieldValue === this.data.exportValue) {
                selected = true;
            }

            let v = _formValues[this.data.id];
            switch (typeof v) {
                case 'string': {
                    selected = (v === this.data.exportValue);
                    break;
                }
                case 'boolean': {
                    selected = v;
                    break;
                }
            }

            if (selected) {
                element.setAttribute('checked', true);
            }

            element.id = 'correctedId' in this.data ? this.data.correctedId : this.data.id;
            element.name = 'correctedId' in this.data ? this.data.correctedId : this.data.id;
            element.title = this.data.alternativeText;
            element.value = this.data.exportValue;

            if (element.id.includes(_formOptions.checkBoxGroupSeparationChar)) {
                const groupId = element.id.substring(0, element.id.indexOf(_formOptions.checkBoxGroupSeparationChar));
                element.setAttribute('data-val-requiredgroup-id', groupId);
            }

            // group name
           if (this.data.required) {
                if (_formOptions.checkBoxRequiredValidation) {

                    if (element.id.includes(_formOptions.checkBoxGroupSeparationChar)) {

                        let matches = _formOptions.checkboxGroupNamePattern.exec(this.data.alternativeText.trim().replace(/\.$/, ''));
                        let msg = (_formOptions.validationMessages.requiredgroup || 'At least one required : {0}');

                        if (matches && matches.length > 0) {
                            msg = msg.replace('{0}', matches[1]);
                        } else {
                            let matches2 = _formOptions.checkboxGroupNamePatternIdFallback.exec('correctedId' in this.data ? this.data.correctedId : this.data.id);
                          
                            if (matches2 && matches2.length > 0) {
                                msg = msg.replace('{0}', matches2[1]);
                            } else {
                                msg = msg.replace('{0}', this.data.alternativeText.trim().replace(/\.$/, '') || 'correctedId' in this.data ? this.data.correctedId : this.data.id);
                            }
                        }

                        element.setAttribute('data-val-requiredgroup', msg);
                        element.setAttribute('data-val', true);
                    } else {
                        const msg = (_formOptions.validationMessages.mandatory ||
                            'Field {0} is mandatory.').replace('{0}', this.data.alternativeText.trim().replace(/\.$/, ''));
                        element.setAttribute('data-val-mandatory', msg);
                        element.setAttribute('required', '');
                        element.className = 'required';
                        element.setAttribute('data-val', true);

                    }
                }

            }

            if (this.renderInteractiveForms) {
                outDiv = AnnotationLayer.addJSActions(element, this.data, this.container, this.data.rect[3] - this.data.rect[1]);
            }

            if (_postCreationTweak) {
                _postCreationTweak(fieldTypes.CHECK_BOX, this.data, element);
            }
        }

        this.container.appendChild(element);

        if (outDiv.errorDiv) {
            this.container.appendChild(outDiv.errorDiv);
        }
        if (outDiv.iconDiv) {
            this.container.appendChild(outDiv.iconDiv);
        }
        return this.container;
    }
}

class RadioButtonWidgetAnnotationElement extends WidgetAnnotationElement {
    constructor(parameters) {
        super(parameters, parameters.renderInteractiveForms);
    }

    /**
     * Render the radio button widget annotation's HTML element
     * in the empty container.
     *
     * @public
     * @memberof RadioButtonWidgetAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = 'buttonWidgetAnnotation radioButton';
        let creationRoutine = idClosureOverrides[this.data.correctedId] || genericClosureOverrides[fieldTypes.TEXT] || false;
        let element = null;
        if (creationRoutine != false) {
            element = creationRoutine(this);
        }
        else {
            element = document.createElement('input');
            element.disabled = this.data.readOnly;
            element.type = 'radio';
            element.id = this.data.correctedId + '_' + this.data.fieldName;
            element.name = this.data.fieldName;
            element.value = this.data.buttonValue;

            let selected = false;
            if (this.data.fieldValue === this.data.buttonValue) {
                selected = true;
            }
            let v = _formValues[this.data.correctedId];
            switch (typeof v) {
                case 'string': {
                    selected = v == this.data.buttonValue;
                    break;
                }
            }
            if (selected) {
                element.setAttribute('checked', true);
            }
            if (_postCreationTweak) {
                _postCreationTweak(fieldTypes.RADIO_BUTTON, this.data, element);
            }
        }
        this.container.appendChild(element);
        return this.container;
    }
}

class PushButtonWidgetAnnotationElement extends LinkAnnotationElement {
    /**
     * Render the push button widget annotation's HTML element
     * in the empty container.
     *
     * @public
     * @memberof PushButtonWidgetAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        // The rendering and functionality of a push button widget annotation is
        // equal to that of a link annotation, but may have more functionality, such
        // as performing actions on form fields (resetting, submitting, et cetera).
        const container = super.render();
        container.className = 'buttonWidgetAnnotation pushButton';
        return container;
    }
}

class ChoiceWidgetAnnotationElement extends WidgetAnnotationElement {
    constructor(parameters) {
        super(parameters, parameters.renderInteractiveForms);
    }

    /**
     * Render the choice widget annotation's HTML element in the empty
     * container.
     *
     * @public
     * @memberof ChoiceWidgetAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = 'choiceWidgetAnnotation';
        let creationRoutine = idClosureOverrides[this.data.correctedId] || genericClosureOverrides[fieldTypes.TEXT] || false;
        let selectElement = null;
        if (creationRoutine != false) {
            selectElement = creationRoutine(this);
        }
        else {
            selectElement = document.createElement('select');
            selectElement.disabled = this.data.readOnly;
            if (this.data.readOnly) {
                element.style.cursor = "not-allowed";
            }

            let value = this.data.fieldValue;
            if (this.data.correctedId in _formValues) {
                value = _formValues[this.data.correctedId];
            } else if (this.data.fullName in _formValues) {
                value = _formValues[this.data.fullName];
            }
            this.data.value = value;

            selectElement.id = !this.data.isGroupMember || this.data.groupingId == 0 ? this.data.correctedId : this.data.id;
            selectElement.name = this.data.correctedId;

            if (!this.data.combo) {
                // List boxes have a size and (optionally) multiple selection.
                selectElement.size = this.data.options.length;

                if (this.data.multiSelect) {
                    selectElement.multiple = true;
                }
            }

            // Insert the options into the choice field.
            for (const option of this.data.options) {
                const optionElement = document.createElement('option');
                optionElement.textContent = option.displayValue;
                optionElement.value = option.exportValue;
                if (option.exportValue == this.data.value) {
                    optionElement.selected = true;
                }

                if (this.data.fieldValue.includes(option.displayValue)) {
                    optionElement.setAttribute('selected', true);
                }

                selectElement.appendChild(optionElement);
            }
        }
        if (_postCreationTweak) {
            _postCreationTweak(fieldTypes.DROP_DOWN, this.data, selectElement);
        }
        this.container.appendChild(selectElement);
        return this.container;
    }
}

class PopupAnnotationElement extends AnnotationElement {
    constructor(parameters) {
    const isRenderable = !!(parameters.data.title || parameters.data.contents);
        super(parameters, isRenderable);
    }

    /**
     * Render the popup annotation's HTML element in the empty container.
     *
     * @public
     * @memberof PopupAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        // Do not render popup annotations for parent elements with these types as
        // they create the popups themselves (because of custom trigger divs).
        const IGNORE_TYPES = [
            'Line',
            'Square',
            'Circle',
            'PolyLine',
            'Polygon',
            'Ink',
        ];

        this.container.className = 'popupAnnotation';

        if (IGNORE_TYPES.includes(this.data.parentType)) {
            return this.container;
        }

        const selector = `[data-annotation-id="${this.data.parentId}"]`;
        const parentElement = this.layer.querySelector(selector);
        if (!parentElement) {
            return this.container;
        }

        const popup = new PopupElement({
            container: this.container,
            trigger: parentElement,
            color: this.data.color,
            title: this.data.title,
            modificationDate: this.data.modificationDate,
            contents: this.data.contents,
        });

        // Position the popup next to the parent annotation's container.
        // PDF viewers ignore a popup annotation's rectangle.
        const parentLeft = parseFloat(parentElement.style.left);
        const parentWidth = parseFloat(parentElement.style.width);
        this.container.style.transformOrigin =
        `-${parentLeft + parentWidth}px -${parentElement.style.top}`;
        this.container.style.left = `${parentLeft + parentWidth}px`;

        this.container.appendChild(popup.render());
        return this.container;
    }
}

class PopupElement {
    constructor(parameters) {
        this.container = parameters.container;
        this.trigger = parameters.trigger;
        this.color = parameters.color;
        this.title = parameters.title;
        this.modificationDate = parameters.modificationDate;
        this.contents = parameters.contents;
        this.hideWrapper = parameters.hideWrapper || false;

        this.pinned = false;
    }

    /**
     * Render the popup's HTML element.
     *
     * @public
     * @memberof PopupElement
     * @returns {HTMLSectionElement}
     */
    render() {
        const BACKGROUND_ENLIGHT = 0.7;

        const wrapper = document.createElement('div');
        wrapper.className = 'popupWrapper';

        // For Popup annotations we hide the entire section because it contains
        // only the popup. However, for Text annotations without a separate Popup
        // annotation, we cannot hide the entire container as the image would
        // disappear too. In that special case, hiding the wrapper suffices.
        this.hideElement = (this.hideWrapper ? wrapper : this.container);
        this.hideElement.setAttribute('hidden', true);

    const popup = document.createElement('div');
        popup.className = 'popup';

    const color = this.color;
        if (color) {
            // Enlighten the color.
      const r = BACKGROUND_ENLIGHT * (255 - color[0]) + color[0];
      const g = BACKGROUND_ENLIGHT * (255 - color[1]) + color[1];
      const b = BACKGROUND_ENLIGHT * (255 - color[2]) + color[2];
            popup.style.backgroundColor = Util.makeCssRgb(r | 0, g | 0, b | 0);
        }

       const title = document.createElement('h1');
        title.textContent = this.title;
       popup.appendChild(title);

    // The modification date is shown in the popup instead of the creation
    // date if it is available and can be parsed correctly, which is
    // consistent with other viewers such as Adobe Acrobat.
    const dateObject = PDFDateString.toDateObject(this.modificationDate);
    if (dateObject) {
      const modificationDate = document.createElement('span');
      modificationDate.textContent = '{{date}}, {{time}}';
      modificationDate.dataset.l10nId = 'annotation_date_string';
      modificationDate.dataset.l10nArgs = JSON.stringify({
        date: dateObject.toLocaleDateString(),
        time: dateObject.toLocaleTimeString(),
      });
      popup.appendChild(modificationDate);
    }

    const contents = this._formatContents(this.contents);
    popup.appendChild(contents);

        // Attach the event listeners to the trigger element.
        this.trigger.addEventListener('click', this._toggle.bind(this));
        this.trigger.addEventListener('mouseover', this._show.bind(this, false));
        this.trigger.addEventListener('mouseout', this._hide.bind(this, false));
        popup.addEventListener('click', this._hide.bind(this, true));

        wrapper.appendChild(popup);
        return wrapper;
    }

    /**
     * Format the contents of the popup by adding newlines where necessary.
     *
     * @private
     * @param {string} contents
     * @memberof PopupElement
     * @returns {HTMLParagraphElement}
     */
    _formatContents(contents) {
        const p = document.createElement('p');
        const lines = contents.split(/(?:\r\n?|\n)/);
        for (let i = 0, ii = lines.length; i < ii; ++i) {
            const line = lines[i];
            p.appendChild(document.createTextNode(line));
            if (i < (ii - 1)) {
                p.appendChild(document.createElement('br'));
            }
        }
        return p;
    }

    /**
     * Toggle the visibility of the popup.
     *
     * @private
     * @memberof PopupElement
     */
    _toggle() {
        if (this.pinned) {
            this._hide(true);
        } else {
            this._show(true);
        }
    }

    /**
     * Show the popup.
     *
     * @private
     * @param {boolean} pin
     * @memberof PopupElement
     */
    _show(pin = false) {
        if (pin) {
            this.pinned = true;
        }
        if (this.hideElement.hasAttribute('hidden')) {
            this.hideElement.removeAttribute('hidden');
            this.container.style.zIndex += 1;
        }
    }

    /**
     * Hide the popup.
     *
     * @private
     * @param {boolean} unpin
     * @memberof PopupElement
     */
    _hide(unpin = true) {
        if (unpin) {
            this.pinned = false;
        }
        if (!this.hideElement.hasAttribute('hidden') && !this.pinned) {
            this.hideElement.setAttribute('hidden', true);
            this.container.style.zIndex -= 1;
        }
    }
}

class FreeTextAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup ||
                            parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, /* ignoreBorder = */ true);
  }

  /**
   * Render the free text annotation's HTML element in the empty container.
   *
   * @public
   * @memberof FreeTextAnnotationElement
   * @returns {HTMLSectionElement}
   */
  render() {
    this.container.className = 'freeTextAnnotation';

    if (!this.data.hasPopup) {
      this._createPopup(this.container, null, this.data);
    }
    return this.container;
  }
}

class LineAnnotationElement extends AnnotationElement {
    constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup ||
            parameters.data.title || parameters.data.contents);
        super(parameters, isRenderable, /* ignoreBorder = */ true);
    }

    /**
     * Render the line annotation's HTML element in the empty container.
     *
     * @public
     * @memberof LineAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = 'lineAnnotation';

        // Create an invisible line with the same starting and ending coordinates
        // that acts as the trigger for the popup. Only the line itself should
        // trigger the popup, not the entire container.
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);

        // PDF coordinates are calculated from a bottom left origin, so transform
        // the line coordinates to a top left origin for the SVG element.
    const line = this.svgFactory.createElement('svg:line');
        line.setAttribute('x1', data.rect[2] - data.lineCoordinates[0]);
        line.setAttribute('y1', data.rect[3] - data.lineCoordinates[1]);
        line.setAttribute('x2', data.rect[2] - data.lineCoordinates[2]);
        line.setAttribute('y2', data.rect[3] - data.lineCoordinates[3]);
        line.setAttribute('stroke-width', data.borderStyle.width);
        line.setAttribute('stroke', 'transparent');

        svg.appendChild(line);
        this.container.append(svg);

        // Create the popup ourselves so that we can bind it to the line instead
        // of to the entire container (which is the default).
        this._createPopup(this.container, line, data);

        return this.container;
    }
}

class SquareAnnotationElement extends AnnotationElement {
    constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup ||
            parameters.data.title || parameters.data.contents);
        super(parameters, isRenderable, /* ignoreBorder = */ true);
    }

    /**
     * Render the square annotation's HTML element in the empty container.
     *
     * @public
     * @memberof SquareAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = 'squareAnnotation';

        // Create an invisible square with the same rectangle that acts as the
        // trigger for the popup. Only the square itself should trigger the
        // popup, not the entire container.
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);

        // The browser draws half of the borders inside the square and half of
        // the borders outside the square by default. This behavior cannot be
        // changed programmatically, so correct for that here.
    const borderWidth = data.borderStyle.width;
    const square = this.svgFactory.createElement('svg:rect');
        square.setAttribute('x', borderWidth / 2);
        square.setAttribute('y', borderWidth / 2);
        square.setAttribute('width', width - borderWidth);
        square.setAttribute('height', height - borderWidth);
        square.setAttribute('stroke-width', borderWidth);
        square.setAttribute('stroke', 'transparent');
        square.setAttribute('fill', 'none');

        svg.appendChild(square);
        this.container.append(svg);

        // Create the popup ourselves so that we can bind it to the square instead
        // of to the entire container (which is the default).
        this._createPopup(this.container, square, data);

        return this.container;
    }
}

class CircleAnnotationElement extends AnnotationElement {
    constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup ||
            parameters.data.title || parameters.data.contents);
        super(parameters, isRenderable, /* ignoreBorder = */ true);
    }

    /**
     * Render the circle annotation's HTML element in the empty container.
     *
     * @public
     * @memberof CircleAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = 'circleAnnotation';

        // Create an invisible circle with the same ellipse that acts as the
        // trigger for the popup. Only the circle itself should trigger the
        // popup, not the entire container.
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);

        // The browser draws half of the borders inside the circle and half of
        // the borders outside the circle by default. This behavior cannot be
        // changed programmatically, so correct for that here.
    const borderWidth = data.borderStyle.width;
    const circle = this.svgFactory.createElement('svg:ellipse');
        circle.setAttribute('cx', width / 2);
        circle.setAttribute('cy', height / 2);
        circle.setAttribute('rx', (width / 2) - (borderWidth / 2));
        circle.setAttribute('ry', (height / 2) - (borderWidth / 2));
        circle.setAttribute('stroke-width', borderWidth);
        circle.setAttribute('stroke', 'transparent');
        circle.setAttribute('fill', 'none');

        svg.appendChild(circle);
        this.container.append(svg);

        // Create the popup ourselves so that we can bind it to the circle instead
        // of to the entire container (which is the default).
        this._createPopup(this.container, circle, data);

        return this.container;
    }
}

class PolylineAnnotationElement extends AnnotationElement {
    constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup ||
            parameters.data.title || parameters.data.contents);
        super(parameters, isRenderable, /* ignoreBorder = */ true);

        this.containerClassName = 'polylineAnnotation';
        this.svgElementName = 'svg:polyline';
    }

    /**
     * Render the polyline annotation's HTML element in the empty container.
     *
     * @public
     * @memberof PolylineAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = this.containerClassName;

        // Create an invisible polyline with the same points that acts as the
        // trigger for the popup. Only the polyline itself should trigger the
        // popup, not the entire container.
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);

        // Convert the vertices array to a single points string that the SVG
        // polyline element expects ("x1,y1 x2,y2 ..."). PDF coordinates are
        // calculated from a bottom left origin, so transform the polyline
        // coordinates to a top left origin for the SVG element.
        let points = [];
    for (const coordinate of data.vertices) {
      const x = coordinate.x - data.rect[0];
      const y = data.rect[3] - coordinate.y;
            points.push(x + ',' + y);
        }
        points = points.join(' ');

    const polyline = this.svgFactory.createElement(this.svgElementName);
        polyline.setAttribute('points', points);
    polyline.setAttribute('stroke-width', data.borderStyle.width);
        polyline.setAttribute('stroke', 'transparent');
        polyline.setAttribute('fill', 'none');

        svg.appendChild(polyline);
        this.container.append(svg);

        // Create the popup ourselves so that we can bind it to the polyline
        // instead of to the entire container (which is the default).
        this._createPopup(this.container, polyline, data);

        return this.container;
    }
}

class PolygonAnnotationElement extends PolylineAnnotationElement {
    constructor(parameters) {
        // Polygons are specific forms of polylines, so reuse their logic.
        super(parameters);

        this.containerClassName = 'polygonAnnotation';
        this.svgElementName = 'svg:polygon';
    }
}

class CaretAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup ||
                            parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, /* ignoreBorder = */ true);
  }

  /**
   * Render the caret annotation's HTML element in the empty container.
   *
   * @public
   * @memberof CaretAnnotationElement
   * @returns {HTMLSectionElement}
   */
  render() {
    this.container.className = 'caretAnnotation';

    if (!this.data.hasPopup) {
      this._createPopup(this.container, null, this.data);
    }
    return this.container;
  }
}

class InkAnnotationElement extends AnnotationElement {
    constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup ||
            parameters.data.title || parameters.data.contents);
        super(parameters, isRenderable, /* ignoreBorder = */ true);

        this.containerClassName = 'inkAnnotation';

        // Use the polyline SVG element since it allows us to use coordinates
        // directly and to draw both straight lines and curves.
        this.svgElementName = 'svg:polyline';
    }

    /**
     * Render the ink annotation's HTML element in the empty container.
     *
     * @public
     * @memberof InkAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = this.containerClassName;

        // Create an invisible polyline with the same points that acts as the
        // trigger for the popup.
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);

    for (const inkList of data.inkLists) {
            // Convert the ink list to a single points string that the SVG
            // polyline element expects ("x1,y1 x2,y2 ..."). PDF coordinates are
            // calculated from a bottom left origin, so transform the polyline
            // coordinates to a top left origin for the SVG element.
      let points = [];
      for (const coordinate of inkList) {
        const x = coordinate.x - data.rect[0];
        const y = data.rect[3] - coordinate.y;
        points.push(`${x},${y}`);
            }

            points = points.join(' ');

      const polyline = this.svgFactory.createElement(this.svgElementName);
            polyline.setAttribute('points', points);
      polyline.setAttribute('stroke-width', data.borderStyle.width);
            polyline.setAttribute('stroke', 'transparent');
            polyline.setAttribute('fill', 'none');

            // Create the popup ourselves so that we can bind it to the polyline
            // instead of to the entire container (which is the default).
            this._createPopup(this.container, polyline, data);

            svg.appendChild(polyline);
        }

        this.container.append(svg);

        return this.container;
    }
}

class HighlightAnnotationElement extends AnnotationElement {
    constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup ||
            parameters.data.title || parameters.data.contents);
        super(parameters, isRenderable, /* ignoreBorder = */ true);
    }

    /**
     * Render the highlight annotation's HTML element in the empty container.
     *
     * @public
     * @memberof HighlightAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = 'highlightAnnotation';

        if (!this.data.hasPopup) {
            this._createPopup(this.container, null, this.data);
        }
        return this.container;
    }
}

class UnderlineAnnotationElement extends AnnotationElement {
    constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup ||
            parameters.data.title || parameters.data.contents);
        super(parameters, isRenderable, /* ignoreBorder = */ true);
    }

    /**
     * Render the underline annotation's HTML element in the empty container.
     *
     * @public
     * @memberof UnderlineAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = 'underlineAnnotation';

        if (!this.data.hasPopup) {
            this._createPopup(this.container, null, this.data);
        }
        return this.container;
    }
}

class SquigglyAnnotationElement extends AnnotationElement {
    constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup ||
            parameters.data.title || parameters.data.contents);
        super(parameters, isRenderable, /* ignoreBorder = */ true);
    }

    /**
     * Render the squiggly annotation's HTML element in the empty container.
     *
     * @public
     * @memberof SquigglyAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = 'squigglyAnnotation';

        if (!this.data.hasPopup) {
            this._createPopup(this.container, null, this.data);
        }
        return this.container;
    }
}

class StrikeOutAnnotationElement extends AnnotationElement {
    constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup ||
            parameters.data.title || parameters.data.contents);
        super(parameters, isRenderable, /* ignoreBorder = */ true);
    }

    /**
     * Render the strikeout annotation's HTML element in the empty container.
     *
     * @public
     * @memberof StrikeOutAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = 'strikeoutAnnotation';

        if (!this.data.hasPopup) {
            this._createPopup(this.container, null, this.data);
        }
        return this.container;
    }
}

class StampAnnotationElement extends AnnotationElement {
    constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup ||
            parameters.data.title || parameters.data.contents);
        super(parameters, isRenderable, /* ignoreBorder = */ true);
    }

    /**
     * Render the stamp annotation's HTML element in the empty container.
     *
     * @public
     * @memberof StampAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = 'stampAnnotation';

        if (!this.data.hasPopup) {
            this._createPopup(this.container, null, this.data);
        }
        return this.container;
    }
}

class FileAttachmentAnnotationElement extends AnnotationElement {
    constructor(parameters) {
        super(parameters, /* isRenderable = */ true);

        const { filename, content, } = this.data.file;
        this.filename = getFilenameFromUrl(filename);
        this.content = content;

        if (this.linkService.eventBus) {
            this.linkService.eventBus.dispatch('fileattachmentannotation', {
                source: this,
                id: stringToPDFString(filename),
                filename,
                content,
            });
        }
    }

    /**
     * Render the file attachment annotation's HTML element in the empty
     * container.
     *
     * @public
     * @memberof FileAttachmentAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render() {
        this.container.className = 'fileAttachmentAnnotation';

    const trigger = document.createElement('div');
        trigger.style.height = this.container.style.height;
        trigger.style.width = this.container.style.width;
        trigger.addEventListener('dblclick', this._download.bind(this));

        if (!this.data.hasPopup && (this.data.title || this.data.contents)) {
            this._createPopup(this.container, trigger, this.data);
        }

        this.container.appendChild(trigger);
        return this.container;
    }

    /**
     * Download the file attachment associated with this annotation.
     *
     * @private
     * @memberof FileAttachmentAnnotationElement
     */
    _download() {
        if (!this.downloadManager) {
            warn('Download cannot be started due to unavailable download manager');
            return;
        }
        this.downloadManager.downloadData(this.content, this.filename, '');
    }
}

/**
 * @typedef {Object} AnnotationLayerParameters
 * @property {PageViewport} viewport
 * @property {HTMLDivElement} div
 * @property {Array} annotations
 * @property {PDFPage} page
 * @property {IPDFLinkService} linkService
 * @property {DownloadManager} downloadManager
 * @property {string} imageResourcesPath - (optional) Path for image resources,
 *   mainly for annotation icons. Include trailing slash.
 * @property {boolean} renderInteractiveForms
 */

let getFormElementFromAnnotation = function(annotation) {
    let x = annotation.hasOwnProperty('container');
    if (x) {
        return annotation.container.children[0];
    }
    let set = [];
    let arrayLength = annotation.length;
    for (let i = 0; i < arrayLength; i++) {
        set.push(annotation[i].container.children[0]);
    }
    return set;
};

let _isSelectMultiple = function(element) {
    for (let i = 0, l = element.attributes.length; i < l; i++) {
        try {
            if (element.attributes[i].name == 'multiple') {
                return true;
            }
        } catch (e) {
        }
    }
    return false;
};

class AnnotationLayer {

    static returnFormElementsOnPage(annotations) {
        let elements = [];
        for (let i = 0, ii = annotations.length; i < ii; i++) {
            let annotation = annotations[i];
            let subtype = annotation.annotationType;
            if (subtype == AnnotationType.WIDGET) {
                annotation = AnnotationElementFactory.correctProps(annotation);
                let fieldType = annotation.fieldType;
                switch (fieldType) {
                    case 'Tx':
                        if (annotation.fullName.indexOf('.`') != -1) {
                            if (annotation.groupingId == 0 ) {
                                elements.push(annotation.correctedId);
                            }
                            else {
                                elements.push(annotation.fullName);
                            }
                        }
                        else {
                            elements.push(annotation.fullName);
                        }
                        break;
                    default:
                        elements.push(annotation.fullName);
                        break;
                }
            }
        }
        return elements;
    }

    /**
     * Render a new annotation layer with all annotation elements.
     *
     * @public
     * @param {AnnotationLayerParameters} parameters
     * @memberof AnnotationLayer
     */
    static render(parameters) {
        _tabIndex = 1;
        _formFields =  {
            'CHECK_BOX': {},
            'TEXT': {},
            'RADIO_BUTTON': {},
            'DROP_DOWN': {}
        };

        for (const data of parameters.annotations) {
            if (!data) {
                continue;
            }
            const element = AnnotationElementFactory.create({
                data,
                layer: parameters.div,
                page: parameters.page,
                viewport: parameters.viewport,
                linkService: parameters.linkService,
                downloadManager: parameters.downloadManager,
                imageResourcesPath: parameters.imageResourcesPath || '',
                renderInteractiveForms: parameters.renderInteractiveForms || false,
                ignoreBorder: parameters.ignoreBorder || true,
                svgFactory: new DOMSVGFactory(),
            });
            let elementClass = element.constructor.name;
            let correctedId = element.getCorrectedId();
            let groupingId = element.getGroupingId();
            switch (elementClass) {
                case 'CheckboxWidgetAnnotationElement':
                    if (groupingId === 0) {
                        _formFields[fieldTypes.CHECK_BOX][correctedId] = element;
                    }
                    break;
                case 'ChoiceWidgetAnnotationElement':
                    if (groupingId == 0) {
                        _formFields[fieldTypes.DROP_DOWN][correctedId] = element;
                    }
                    break;
                case 'TextWidgetAnnotationElement':
                    if (groupingId == 0) {
                        _formFields[fieldTypes.TEXT][correctedId] = element;
                    }
                    break;
                case 'RadioButtonWidgetAnnotationElement':
                    _formFields[fieldTypes.RADIO_BUTTON][correctedId] = _formFields[fieldTypes.RADIO_BUTTON][correctedId] || [];
                    _formFields[fieldTypes.RADIO_BUTTON][correctedId].push(element);
                    break;
            }
            if (element.isRenderable) {
                parameters.div.appendChild(element.render());
            }
        }
    }

    /**
     * Update the annotation elements on existing annotation layer.
     *
     * @public
     * @param {AnnotationLayerParameters} parameters
     * @memberof AnnotationLayer
     */
    static update(parameters) {
      for (const data of parameters.annotations) {
        const element = parameters.div.querySelector(
          `[data-annotation-id="${data.id}"]`);
        if (element) {
          element.style.transform =
          `matrix(${parameters.viewport.transform.join(',')})`;
        }
      }
        parameters.div.removeAttribute('hidden');
    }

    static getValues() {
        let values = {};
        let visitElements = function (set, action) {
            let elementIds = Object.keys(set);
            elementIds.forEach(function (elementId) {
                let element = getFormElementFromAnnotation(set[elementId]);
                if (element)
                    action(elementId, element);
            });
        };
        visitElements(_formFields[fieldTypes.CHECK_BOX], function (elementId, element) {
            values[elementId] = element.checked ? true : false;
        });
        visitElements(_formFields[fieldTypes.TEXT], function (elementId, element) {
            values[elementId] = element.value;
        });
        visitElements(_formFields[fieldTypes.DROP_DOWN], function (elementId, element) {
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
        visitElements(_formFields[fieldTypes.RADIO_BUTTON], function (elementId, element) {
            element.some(function (r) {
                if (r.checked)
                    values[elementId] = r.value;
                return r.checked;
            });
        });
        return values;
    }

    static setValues(values) {
        _formValues = values;
    }

    static setOptions(options) {
        options.validationMessages = options.validationMessages || [];
        options.validationMessages.pdfformat = options.validationMessages.pdfformat || [];
        options.checkBoxGroupSeparationChar = options.checkBoxGroupSeparationChar || '_';
        options.checkboxGroupNamePattern = options.checkboxGroupNamePattern || /\(([^)]+)\)/;
        options.checkboxGroupNamePatternIdFallback = options.checkboxGroupNamePatternIdFallback || /\-(\w*)\_/;
        options.checkBoxRequiredValidation = options.checkBoxRequiredValidation || false;
        _formOptions = options;
    }

    static clearControlRendersById() {
        idClosureOverrides = {};
    }

    static clearControlRendersByType() {
        genericClosureOverrides = {};
    }

    static setControlRenderClosureByType(closure, type) {
        if (type != 'CHECK_BOX' && type != 'TEXT' && type != 'DROP_DOWN' && type != 'RADIO_BUTTON') {
            throw "type must be one of the following: CHECK_BOX, TEXT, DROP_DOWN, RADIO_BUTTON";
        }
        if (!closure) {
            try {
                delete genericClosureOverrides[type];
            } catch (e) {
            }
        } else {
            genericClosureOverrides[type] = closure;
        }
    }

    static setControlRenderClosureById(closure, id) {
        if (!closure) {
            try {
                delete idClosureOverrides[id];
            } catch (e) {
            }
        } else {
            idClosureOverrides[id] = closure;
        }
    }

    static addJSActions(element, data, container, size) {

        let addDataVal = false;
        let outDiv = { iconDiv: null, errorDiv: null, };

        if (data.required && data.checkBox !== true) {
            const msg = (_formOptions.validationMessages.required ||
                            'Field {0} is required.').replace('{0}', data.alternativeText.trim().replace(/\.$/, ''));
            element.setAttribute('data-val-required', msg);
            element.setAttribute('required', '');

            let iconDiv = document.createElement('div');
            iconDiv.className = 'required-field-icon';
            iconDiv.setAttribute('aria-hidden', true);
            iconDiv.textContent = '*';
            outDiv.iconDiv = iconDiv;
 
            addDataVal = true;
        }

        if (data.action.JS) {
            element.setAttribute('data-js-actionjs', btoa(data.action.JS));
            element.addEventListener('change', function(event) {
                let data = event.target.getAttribute('data-js-actionjs');
                // eslint-disable-next-line no-undef
                pdfjsViewer.FormFunctionality.javascriptEvent(event, data);
            });
        }

        if (data.action.JSFormat || data.action.JSKeypress) {
            let jsdata = data.action.JSFormat || data.action.JSKeypress;
            let formatType = 'custom';
            let skip = false;
            let msgFormat = '';

            if (jsdata.startsWith('AFNumber_')) {
                formatType = 'number';
                msgFormat = (_formOptions.validationMessages.pdfformat.number ||
                    'Invalid value for {0} field.').replace('{0}', data.alternativeText.trim().replace(/\.$/, ''));

            } else if (jsdata.startsWith('AFDate_')) {
                formatType = 'date';
                msgFormat = (_formOptions.validationMessages.pdfformat.date ||
                    'Invalid value for {0} field.').replace('{0}', data.alternativeText.trim().replace(/\.$/, ''));

            } else if (jsdata.startsWith('AFTime_')) {
                formatType = 'time';
                msgFormat = (_formOptions.validationMessages.pdfformat.time ||
                    'Invalid value for {0} field.').replace('{0}', data.alternativeText.trim().replace(/\.$/, ''));

            } else if (jsdata.startsWith('AFSpecial_')) {
                formatType = 'special';
                msgFormat = (_formOptions.validationMessages.pdfformat.special ||
                    'Invalid value for {0} field.').replace('{0}', data.alternativeText.trim().replace(/\.$/, ''));

            } else if (jsdata.startsWith('AFPercent_')) {
                formatType = 'percent';
                msgFormat = (_formOptions.validationMessages.pdfformat.percent ||
                    'Invalid value for {0} field.').replace('{0}', data.alternativeText.trim().replace(/\.$/, ''));
            } else {
                if (data.action.JSKeypress && jsdata.startsWith('AF')) {
                    skip = true;
                } else {
                    formatType = 'custom';
                    msgFormat = (_formOptions.validationMessages.pdfformat.custom ||
                        'Invalid value for {0} field.').replace('{0}', data.alternativeText.trim().replace(/\.$/, ''));
  
                }
            }
            if (!skip) {
                let regexpFunction = /\(([^)]+)\)/;
                let matches = regexpFunction.exec(jsdata);

                if (matches && matches.length > 0) {
                    let format = matches[1].split(',')[0].replace('>', '').trim();

                    msgFormat = msgFormat.replace('{1}', format);
                } else {
                    msgFormat = msgFormat.replace('{1}', '');
                }

                element.setAttribute('data-val-pdfformat', msgFormat.trim());
                element.setAttribute('data-val-pdfformat-type', formatType);
                element.setAttribute('data-val-pdfformat-data', btoa(jsdata));

                addDataVal = true;
            }
        }

         /* if (data.action.JSFo) {
            element.setAttribute('data-js-action-fo', btoa(data.action.JSFo));
            element.addEventListener('focus', function(event) {
                let data = event.target.getAttribute('data-js-action-fo');
                // eslint-disable-next-line no-undef
                pdfjsViewer.FormFunctionality.javascriptEvent(event, data);
             });
        } */
        
       /* if (data.action.JSBl) {
            element.setAttribute('data-js-action-bl', btoa(data.action.JSBl));
            element.addEventListener('blur', function(event) {
                let data = event.target.getAttribute('data-js-action-bl');
                // eslint-disable-next-line no-undef
                pdfjsViewer.FormFunctionality.javascriptEvent(event, data);
             });
        } */
 
        /* if (data.action.JSU) {
            element.setAttribute('data-js-action-u', btoa(data.action.JSU));
            element.addEventListener('mouseup', function(event) {
                let data = event.target.getAttribute('data-js-action-u');
                // eslint-disable-next-line no-undef
                pdfjsViewer.FormFunctionality.javascriptEvent(event, data);
            });
        } */

         /*if (data.action.JSKeypress) {

            if
            element.setAttribute('data-js-action-keypress', btoa(data.action.JSKeypress));
            element.addEventListener('keypress', function(event) {
                let data = event.target.getAttribute('data-js-action-keypress');
                // eslint-disable-next-line no-undef
                pdfjsViewer.FormFunctionality.javascriptEvent(event, data);
            });
        }*/

        if (addDataVal) {
            element.setAttribute('data-val', 'true');

            let errorDiv = document.createElement('div');
            errorDiv.className = 'field-validation-valid field-error-message';
            errorDiv.setAttribute('data-valmsg-for', element.id);
            errorDiv.setAttribute('data-valmsg-replace', 'true');
            errorDiv.setAttribute('style', 'top:' + size + 'px');
            outDiv.errorDiv = errorDiv;
        }

        return outDiv;
    }

    static setPostCreationTweak(postCallback) {
        _postCreationTweak = postCallback;
    }
}

export {
    AnnotationLayer,
};
