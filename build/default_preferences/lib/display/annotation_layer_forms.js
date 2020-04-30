"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnnotationLayer = void 0;

var _display_utils = require("./display_utils");

var _util = require("../shared/util");

let _tabIndex = 1;
let _formValues = [];
let _formOptions = [];
let _formFields = {
  'CHECK_BOX': {},
  'TEXT': {},
  'RADIO_BUTTON': {},
  'DROP_DOWN': {}
};
let fieldTypes = {
  UNSUPPORTED: false,
  CHECK_BOX: 'CHECK_BOX',
  DROP_DOWN: 'DROP_DOWN',
  PUSH_BUTTON: 'PUSH_BUTTON',
  RADIO_BUTTON: 'RADIO_BUTTON',
  TEXT: 'TEXT'
};
let genericClosureOverrides = {};
let idClosureOverrides = {};
let _postCreationTweak = false;

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

  static create(parameters) {
    const subtype = parameters.data.annotationType;

    switch (subtype) {
      case _util.AnnotationType.LINK:
        return new LinkAnnotationElement(parameters);

      case _util.AnnotationType.TEXT:
        return new TextAnnotationElement(parameters);

      case _util.AnnotationType.WIDGET:
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

      case _util.AnnotationType.POPUP:
        return new PopupAnnotationElement(parameters);

      case _util.AnnotationType.FREETEXT:
        return new FreeTextAnnotationElement(parameters);

      case _util.AnnotationType.LINE:
        return new LineAnnotationElement(parameters);

      case _util.AnnotationType.SQUARE:
        return new SquareAnnotationElement(parameters);

      case _util.AnnotationType.CIRCLE:
        return new CircleAnnotationElement(parameters);

      case _util.AnnotationType.POLYLINE:
        return new PolylineAnnotationElement(parameters);

      case _util.AnnotationType.CARET:
        return new CaretAnnotationElement(parameters);

      case _util.AnnotationType.INK:
        return new InkAnnotationElement(parameters);

      case _util.AnnotationType.POLYGON:
        return new PolygonAnnotationElement(parameters);

      case _util.AnnotationType.HIGHLIGHT:
        return new HighlightAnnotationElement(parameters);

      case _util.AnnotationType.UNDERLINE:
        return new UnderlineAnnotationElement(parameters);

      case _util.AnnotationType.SQUIGGLY:
        return new SquigglyAnnotationElement(parameters);

      case _util.AnnotationType.STRIKEOUT:
        return new StrikeOutAnnotationElement(parameters);

      case _util.AnnotationType.STAMP:
        return new StampAnnotationElement(parameters);

      case _util.AnnotationType.FILEATTACHMENT:
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

  _createContainer(ignoreBorder = false) {
    const data = this.data,
          page = this.page,
          viewport = this.viewport;
    const container = document.createElement('section');
    let width = data.rect[2] - data.rect[0];
    let height = data.rect[3] - data.rect[1];
    container.setAttribute('data-annotation-id', data.id);

    const rect = _util.Util.normalizeRect([data.rect[0], page.view[3] - data.rect[1] + page.view[1], data.rect[2], page.view[3] - data.rect[3] + page.view[1]]);

    container.style.transform = `matrix(${viewport.transform.join(',')})`;

    if (!ignoreBorder && data.borderStyle.width > 0) {
      container.style.borderWidth = `${data.borderStyle.width}px`;

      if (data.borderStyle.style !== _util.AnnotationBorderStyleType.UNDERLINE) {
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
        case _util.AnnotationBorderStyleType.SOLID:
          container.style.borderStyle = 'solid';
          break;

        case _util.AnnotationBorderStyleType.DASHED:
          container.style.borderStyle = 'dashed';
          break;

        case _util.AnnotationBorderStyleType.BEVELED:
          (0, _util.warn)('Unimplemented border style: beveled');
          break;

        case _util.AnnotationBorderStyleType.INSET:
          (0, _util.warn)('Unimplemented border style: inset');
          break;

        case _util.AnnotationBorderStyleType.UNDERLINE:
          container.style.borderBottomStyle = 'solid';
          break;

        default:
          break;
      }

      if (data.color) {
        container.style.backgroundColor = _util.Util.makeCssRgb(data.color[0] | 0, data.color[1] | 0, data.color[2] | 0);
      }

      if (data.borderStyle.borderColor) {
        container.style.borderColor = _util.Util.makeCssRgb(data.borderStyle.borderColor[0] | 0, data.borderStyle.borderColor[1] | 0, data.borderStyle.borderColor[2] | 0);
      } else {
        container.style.borderWidth = 0;
      }
    }

    container.style.transformOrigin = `-${rect[0]}px -${rect[1]}px`;
    container.style.left = `${rect[0]}px`;
    container.style.top = `${rect[1]}px`;
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    return container;
  }

  _createPopup(container, trigger, data) {
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
      hideWrapper: true
    });
    const popup = popupElement.render();
    popup.style.left = container.style.width;
    container.appendChild(popup);
  }

  getCorrectedId() {
    return this.data.correctedId;
  }

  getGroupingId() {
    return this.data.groupingId;
  }

  render() {
    (0, _util.unreachable)('Abstract method `AnnotationElement.render` called');
  }

}

class LinkAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.url || parameters.data.dest || parameters.data.action);
    super(parameters, isRenderable);
  }

  render() {
    this.container.className = 'linkAnnotation';
    const {
      data,
      linkService
    } = this;
    const link = document.createElement('a');

    if (data.url) {
      (0, _display_utils.addLinkAttributes)(link, {
        url: data.url,
        target: data.newWindow ? _display_utils.LinkTarget.BLANK : linkService.externalLinkTarget,
        rel: linkService.externalLinkRel,
        enabled: linkService.externalLinkEnabled
      });
    } else if (data.action) {
      this._bindNamedAction(link, data.action);
    } else {
      this._bindLink(link, data.dest);
    }

    this.container.appendChild(link);
    return this.container;
  }

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
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable);
  }

  render() {
    this.container.className = 'textAnnotation';
    const image = document.createElement('img');
    image.style.height = this.container.style.height;
    image.style.width = this.container.style.width;
    image.src = this.imageResourcesPath + 'annotation-' + this.data.name.toLowerCase() + '.svg';
    image.alt = '[{{type}} Annotation]';
    image.dataset.l10nId = 'text_annotation_type';
    image.dataset.l10nArgs = JSON.stringify({
      type: this.data.name
    });

    if (!this.data.hasPopup) {
      this._createPopup(this.container, image, this.data);
    }

    this.container.appendChild(image);
    return this.container;
  }

}

class WidgetAnnotationElement extends AnnotationElement {
  render() {
    return this.container;
  }

}

class TextWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    const isRenderable = parameters.renderInteractiveForms || !parameters.data.hasAppearance && !!parameters.data.fieldValue;
    super(parameters, isRenderable);
  }

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
          this.data.readOnly = true;
        }

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

      if (this.data.fontRefName && this.page.commonObjs.has(this.data.fontRefName)) {
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

  _setTextStyle(element, font) {
    const style = element.style;
    style.fontSize = `${this.data.fontSize}px`;
    style.direction = this.data.fontDirection < 0 ? 'rtl' : 'ltr';

    if (!font) {
      return;
    }

    style.fontWeight = font.black ? font.bold ? '900' : 'bold' : font.bold ? 'bold' : 'normal';
    style.fontStyle = font.italic ? 'italic' : 'normal';
    const fontFamily = font.loadedName ? `"${font.loadedName}", ` : '';
    const fallbackName = font.fallbackName || 'Helvetica, sans-serif';
    style.fontFamily = fontFamily + fallbackName;
  }

}

class CheckboxWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    super(parameters, parameters.renderInteractiveForms, parameters.ignoreBorder);
  }

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

      if (this.data.fieldValue && this.data.fieldValue === this.data.exportValue) {
        selected = true;
      }

      let v = _formValues[this.data.id];

      switch (typeof v) {
        case 'string':
          {
            selected = v === this.data.exportValue;
            break;
          }

        case 'boolean':
          {
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

      if (this.data.required) {
        if (_formOptions.checkBoxRequiredValidation) {
          if (element.id.includes(_formOptions.checkBoxGroupSeparationChar)) {
            let matches = _formOptions.checkboxGroupNamePattern.exec(this.data.alternativeText.trim().replace(/\.$/, ''));

            let msg = _formOptions.validationMessages.requiredgroup || 'At least one required : {0}';

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
            const msg = (_formOptions.validationMessages.mandatory || 'Field {0} is mandatory.').replace('{0}', this.data.alternativeText.trim().replace(/\.$/, ''));
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

  render() {
    this.container.className = 'buttonWidgetAnnotation radioButton';
    let creationRoutine = idClosureOverrides[this.data.correctedId] || genericClosureOverrides[fieldTypes.TEXT] || false;
    let element = null;

    if (creationRoutine != false) {
      element = creationRoutine(this);
    } else {
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
        case 'string':
          {
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
  render() {
    const container = super.render();
    container.className = 'buttonWidgetAnnotation pushButton';
    return container;
  }

}

class ChoiceWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    super(parameters, parameters.renderInteractiveForms);
  }

  render() {
    this.container.className = 'choiceWidgetAnnotation';
    let creationRoutine = idClosureOverrides[this.data.correctedId] || genericClosureOverrides[fieldTypes.TEXT] || false;
    let selectElement = null;

    if (creationRoutine != false) {
      selectElement = creationRoutine(this);
    } else {
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
        selectElement.size = this.data.options.length;

        if (this.data.multiSelect) {
          selectElement.multiple = true;
        }
      }

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

  render() {
    const IGNORE_TYPES = ['Line', 'Square', 'Circle', 'PolyLine', 'Polygon', 'Ink'];
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
      contents: this.data.contents
    });
    const parentLeft = parseFloat(parentElement.style.left);
    const parentWidth = parseFloat(parentElement.style.width);
    this.container.style.transformOrigin = `-${parentLeft + parentWidth}px -${parentElement.style.top}`;
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

  render() {
    const BACKGROUND_ENLIGHT = 0.7;
    const wrapper = document.createElement('div');
    wrapper.className = 'popupWrapper';
    this.hideElement = this.hideWrapper ? wrapper : this.container;
    this.hideElement.setAttribute('hidden', true);
    const popup = document.createElement('div');
    popup.className = 'popup';
    const color = this.color;

    if (color) {
      const r = BACKGROUND_ENLIGHT * (255 - color[0]) + color[0];
      const g = BACKGROUND_ENLIGHT * (255 - color[1]) + color[1];
      const b = BACKGROUND_ENLIGHT * (255 - color[2]) + color[2];
      popup.style.backgroundColor = _util.Util.makeCssRgb(r | 0, g | 0, b | 0);
    }

    const title = document.createElement('h1');
    title.textContent = this.title;
    popup.appendChild(title);

    const dateObject = _display_utils.PDFDateString.toDateObject(this.modificationDate);

    if (dateObject) {
      const modificationDate = document.createElement('span');
      modificationDate.textContent = '{{date}}, {{time}}';
      modificationDate.dataset.l10nId = 'annotation_date_string';
      modificationDate.dataset.l10nArgs = JSON.stringify({
        date: dateObject.toLocaleDateString(),
        time: dateObject.toLocaleTimeString()
      });
      popup.appendChild(modificationDate);
    }

    const contents = this._formatContents(this.contents);

    popup.appendChild(contents);
    this.trigger.addEventListener('click', this._toggle.bind(this));
    this.trigger.addEventListener('mouseover', this._show.bind(this, false));
    this.trigger.addEventListener('mouseout', this._hide.bind(this, false));
    popup.addEventListener('click', this._hide.bind(this, true));
    wrapper.appendChild(popup);
    return wrapper;
  }

  _formatContents(contents) {
    const p = document.createElement('p');
    const lines = contents.split(/(?:\r\n?|\n)/);

    for (let i = 0, ii = lines.length; i < ii; ++i) {
      const line = lines[i];
      p.appendChild(document.createTextNode(line));

      if (i < ii - 1) {
        p.appendChild(document.createElement('br'));
      }
    }

    return p;
  }

  _toggle() {
    if (this.pinned) {
      this._hide(true);
    } else {
      this._show(true);
    }
  }

  _show(pin = false) {
    if (pin) {
      this.pinned = true;
    }

    if (this.hideElement.hasAttribute('hidden')) {
      this.hideElement.removeAttribute('hidden');
      this.container.style.zIndex += 1;
    }
  }

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
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

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
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

  render() {
    this.container.className = 'lineAnnotation';
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);
    const line = this.svgFactory.createElement('svg:line');
    line.setAttribute('x1', data.rect[2] - data.lineCoordinates[0]);
    line.setAttribute('y1', data.rect[3] - data.lineCoordinates[1]);
    line.setAttribute('x2', data.rect[2] - data.lineCoordinates[2]);
    line.setAttribute('y2', data.rect[3] - data.lineCoordinates[3]);
    line.setAttribute('stroke-width', data.borderStyle.width);
    line.setAttribute('stroke', 'transparent');
    svg.appendChild(line);
    this.container.append(svg);

    this._createPopup(this.container, line, data);

    return this.container;
  }

}

class SquareAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

  render() {
    this.container.className = 'squareAnnotation';
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);
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

    this._createPopup(this.container, square, data);

    return this.container;
  }

}

class CircleAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

  render() {
    this.container.className = 'circleAnnotation';
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);
    const borderWidth = data.borderStyle.width;
    const circle = this.svgFactory.createElement('svg:ellipse');
    circle.setAttribute('cx', width / 2);
    circle.setAttribute('cy', height / 2);
    circle.setAttribute('rx', width / 2 - borderWidth / 2);
    circle.setAttribute('ry', height / 2 - borderWidth / 2);
    circle.setAttribute('stroke-width', borderWidth);
    circle.setAttribute('stroke', 'transparent');
    circle.setAttribute('fill', 'none');
    svg.appendChild(circle);
    this.container.append(svg);

    this._createPopup(this.container, circle, data);

    return this.container;
  }

}

class PolylineAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
    this.containerClassName = 'polylineAnnotation';
    this.svgElementName = 'svg:polyline';
  }

  render() {
    this.container.className = this.containerClassName;
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);
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

    this._createPopup(this.container, polyline, data);

    return this.container;
  }

}

class PolygonAnnotationElement extends PolylineAnnotationElement {
  constructor(parameters) {
    super(parameters);
    this.containerClassName = 'polygonAnnotation';
    this.svgElementName = 'svg:polygon';
  }

}

class CaretAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

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
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
    this.containerClassName = 'inkAnnotation';
    this.svgElementName = 'svg:polyline';
  }

  render() {
    this.container.className = this.containerClassName;
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);

    for (const inkList of data.inkLists) {
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

      this._createPopup(this.container, polyline, data);

      svg.appendChild(polyline);
    }

    this.container.append(svg);
    return this.container;
  }

}

class HighlightAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

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
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

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
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

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
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

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
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

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
    super(parameters, true);
    const {
      filename,
      content
    } = this.data.file;
    this.filename = (0, _display_utils.getFilenameFromUrl)(filename);
    this.content = content;

    if (this.linkService.eventBus) {
      this.linkService.eventBus.dispatch('fileattachmentannotation', {
        source: this,
        id: (0, _util.stringToPDFString)(filename),
        filename,
        content
      });
    }
  }

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

  _download() {
    if (!this.downloadManager) {
      (0, _util.warn)('Download cannot be started due to unavailable download manager');
      return;
    }

    this.downloadManager.downloadData(this.content, this.filename, '');
  }

}

let getFormElementFromAnnotation = function (annotation) {
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

let _isSelectMultiple = function (element) {
  for (let i = 0, l = element.attributes.length; i < l; i++) {
    try {
      if (element.attributes[i].name == 'multiple') {
        return true;
      }
    } catch (e) {}
  }

  return false;
};

class AnnotationLayer {
  static returnFormElementsOnPage(annotations) {
    let elements = [];

    for (let i = 0, ii = annotations.length; i < ii; i++) {
      let annotation = annotations[i];
      let subtype = annotation.annotationType;

      if (subtype == _util.AnnotationType.WIDGET) {
        annotation = AnnotationElementFactory.correctProps(annotation);
        let fieldType = annotation.fieldType;

        switch (fieldType) {
          case 'Tx':
            if (annotation.fullName.indexOf('.`') != -1) {
              if (annotation.groupingId == 0) {
                elements.push(annotation.correctedId);
              } else {
                elements.push(annotation.fullName);
              }
            } else {
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

  static render(parameters) {
    _tabIndex = 1;
    _formFields = {
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
        svgFactory: new _display_utils.DOMSVGFactory()
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

  static update(parameters) {
    for (const data of parameters.annotations) {
      const element = parameters.div.querySelector(`[data-annotation-id="${data.id}"]`);

      if (element) {
        element.style.transform = `matrix(${parameters.viewport.transform.join(',')})`;
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
        if (element) action(elementId, element);
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
        if (r.checked) values[elementId] = r.value;
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
      } catch (e) {}
    } else {
      genericClosureOverrides[type] = closure;
    }
  }

  static setControlRenderClosureById(closure, id) {
    if (!closure) {
      try {
        delete idClosureOverrides[id];
      } catch (e) {}
    } else {
      idClosureOverrides[id] = closure;
    }
  }

  static addJSActions(element, data, container, size) {
    let addDataVal = false;
    let outDiv = {
      iconDiv: null,
      errorDiv: null
    };

    if (data.required && data.checkBox !== true) {
      const msg = (_formOptions.validationMessages.required || 'Field {0} is required.').replace('{0}', data.alternativeText.trim().replace(/\.$/, ''));
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
      element.addEventListener('click', function (event) {
        let data = event.target.getAttribute('data-js-actionjs');
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
        msgFormat = (_formOptions.validationMessages.pdfformat.number || 'Invalid value for {0} field.').replace('{0}', data.alternativeText.trim().replace(/\.$/, ''));
      } else if (jsdata.startsWith('AFDate_')) {
        formatType = 'date';
        msgFormat = (_formOptions.validationMessages.pdfformat.date || 'Invalid value for {0} field.').replace('{0}', data.alternativeText.trim().replace(/\.$/, ''));
      } else if (jsdata.startsWith('AFTime_')) {
        formatType = 'time';
        msgFormat = (_formOptions.validationMessages.pdfformat.time || 'Invalid value for {0} field.').replace('{0}', data.alternativeText.trim().replace(/\.$/, ''));
      } else if (jsdata.startsWith('AFSpecial_')) {
        formatType = 'special';
        msgFormat = (_formOptions.validationMessages.pdfformat.special || 'Invalid value for {0} field.').replace('{0}', data.alternativeText.trim().replace(/\.$/, ''));
      } else if (jsdata.startsWith('AFPercent_')) {
        formatType = 'percent';
        msgFormat = (_formOptions.validationMessages.pdfformat.percent || 'Invalid value for {0} field.').replace('{0}', data.alternativeText.trim().replace(/\.$/, ''));
      } else {
        if (data.action.JSKeypress && jsdata.startsWith('AF')) {
          skip = true;
        } else {
          formatType = 'custom';
          msgFormat = (_formOptions.validationMessages.pdfformat.custom || 'Invalid value for {0} field.').replace('{0}', data.alternativeText.trim().replace(/\.$/, ''));
        }
      }

      if (!skip) {
        let regexpFunction = /\(([^)]+)\)/;
        let matches = regexpFunction.exec(jsdata);

        if (matches && matches.length > 0) {
          let format = matches[1].split(',').replace('>', '').trim();
          msgFormat = msgFormat.replace('{1}', format[0]);
        } else {
          msgFormat = msgFormat.replace('{1}', '');
        }

        element.setAttribute('data-val-pdfformat', msgFormat.trim());
        element.setAttribute('data-val-pdfformat-type', formatType);
        element.setAttribute('data-val-pdfformat-data', btoa(jsdata));
        addDataVal = true;
      }
    }

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

exports.AnnotationLayer = AnnotationLayer;