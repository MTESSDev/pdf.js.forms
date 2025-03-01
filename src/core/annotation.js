/* Copyright 2012 Mozilla Foundation
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
  AnnotationBorderStyleType, AnnotationFieldFlag, AnnotationFlag,
  AnnotationReplyType, AnnotationType, assert, bytesToString, isString, OPS,
  stringToBytes, stringToPDFString, Util, warn
} from '../shared/util';
import { Catalog, FileSpec, ObjectLoader } from './obj';
import { Dict, isDict, isName, isRef, isStream } from './primitives';
import { ColorSpace } from './colorspace';
import { getInheritableProperty } from './core_utils';
import { OperatorList } from './operator_list';
import { Stream } from './stream';

class AnnotationFactory {
  /**
   * Create an `Annotation` object of the correct type for the given reference
   * to an annotation dictionary. This yields a promise that is resolved when
   * the `Annotation` object is constructed.
   *
   * @param {XRef} xref
   * @param {Object} ref
   * @param {PDFManager} pdfManager
   * @param {Object} idFactory
   * @return {Promise} A promise that is resolved with an {Annotation} instance.
   */
  static create(xref, ref, pdfManager, idFactory) {
    return pdfManager.ensure(this, '_create',
                             [xref, ref, pdfManager, idFactory]);
  }

  /**
   * @private
   */
  static _create(xref, ref, pdfManager, idFactory) {
    const dict = xref.fetchIfRef(ref);
    if (!isDict(dict)) {
      return undefined;
    }
    const id = isRef(ref) ? ref.toString() : `annot_${idFactory.createObjId()}`;

    // Determine the annotation's subtype.
    let subtype = dict.get('Subtype');
    subtype = isName(subtype) ? subtype.name : null;

    // Return the right annotation object based on the subtype and field type.
    const parameters = {
      xref,
      dict,
      subtype,
      id,
      pdfManager,
    };

    switch (subtype) {
      case 'Link':
        return new LinkAnnotation(parameters);

      case 'Text':
        return new TextAnnotation(parameters);

      case 'Widget':
        let fieldType = getInheritableProperty({ dict, key: 'FT', });
        fieldType = isName(fieldType) ? fieldType.name : null;

        switch (fieldType) {
          case 'Tx':
            return new TextWidgetAnnotation(parameters);
          case 'Btn':
            return new ButtonWidgetAnnotation(parameters);
          case 'Ch':
            return new ChoiceWidgetAnnotation(parameters);
        }
        warn('Unimplemented widget field type "' + fieldType + '", ' +
             'falling back to base field type.');
        return new WidgetAnnotation(parameters);

      case 'Popup':
        return new PopupAnnotation(parameters);

      case 'FreeText':
        return new FreeTextAnnotation(parameters);

      case 'Line':
        return new LineAnnotation(parameters);

      case 'Square':
        return new SquareAnnotation(parameters);

      case 'Circle':
        return new CircleAnnotation(parameters);

      case 'PolyLine':
        return new PolylineAnnotation(parameters);

      case 'Polygon':
        return new PolygonAnnotation(parameters);

      case 'Caret':
        return new CaretAnnotation(parameters);

      case 'Ink':
        return new InkAnnotation(parameters);

      case 'Highlight':
        return new HighlightAnnotation(parameters);

      case 'Underline':
        return new UnderlineAnnotation(parameters);

      case 'Squiggly':
        return new SquigglyAnnotation(parameters);

      case 'StrikeOut':
        return new StrikeOutAnnotation(parameters);

      case 'Stamp':
        return new StampAnnotation(parameters);

      case 'FileAttachment':
        return new FileAttachmentAnnotation(parameters);

      default:
        if (!subtype) {
          warn('Annotation is missing the required /Subtype.');
        } else {
          warn('Unimplemented annotation type "' + subtype + '", ' +
               'falling back to base annotation.');
        }
        return new Annotation(parameters);
    }
  }
}

function getQuadPoints(dict, rect) {
  if (!dict.has('QuadPoints')) {
    return null;
  }

  // The region is described as a number of quadrilaterals.
  // Each quadrilateral must consist of eight coordinates.
  const quadPoints = dict.getArray('QuadPoints');
  if (!Array.isArray(quadPoints) || quadPoints.length % 8 > 0) {
    return null;
  }

  const quadPointsLists = [];
  for (let i = 0, ii = quadPoints.length / 8; i < ii; i++) {
    // Each series of eight numbers represents the coordinates for one
    // quadrilateral in the order [x1, y1, x2, y2, x3, y3, x4, y4].
    // Convert this to an array of objects with x and y coordinates.
    quadPointsLists.push([]);
    for (let j = i * 8, jj = (i * 8) + 8; j < jj; j += 2) {
      const x = quadPoints[j];
      const y = quadPoints[j + 1];

      // The quadpoints should be ignored if any coordinate in the array
      // lies outside the region specified by the rectangle.
      if (x < rect[0] || x > rect[2] || y < rect[1] || y > rect[3]) {
        return null;
      }
      quadPointsLists[i].push({ x, y, });
    }
  }
  return quadPointsLists;
}

function getTransformMatrix(rect, bbox, matrix) {
  // 12.5.5: Algorithm: Appearance streams
  const [minX, minY, maxX, maxY] =
    Util.getAxialAlignedBoundingBox(bbox, matrix);
  if (minX === maxX || minY === maxY) {
    // From real-life file, bbox was [0, 0, 0, 0]. In this case,
    // just apply the transform for rect
    return [1, 0, 0, 1, rect[0], rect[1]];
  }

  const xRatio = (rect[2] - rect[0]) / (maxX - minX);
  const yRatio = (rect[3] - rect[1]) / (maxY - minY);
  return [
    xRatio,
    0,
    0,
    yRatio,
    rect[0] - minX * xRatio,
    rect[1] - minY * yRatio
  ];
}

class Annotation {
  constructor(params) {
    const dict = params.dict;

    this.setContents(dict.get('Contents'));
    this.setModificationDate(dict.get('M'));
    this.setFlags(dict.get('F'));
    this.setRectangle(dict.getArray('Rect'));
    this.setColor(dict.getArray('C') ||
              (dict.has('MK') && dict.get('MK').getArray('BG')) || []);
    this.setBorderStyle(dict);
    this.setAppearance(dict);

    // Expose public properties using a data object.
    this.data = {
      annotationFlags: this.flags,
      borderStyle: this.borderStyle,
      color: this.color,
      contents: this.contents,
      hasAppearance: !!this.appearance,
      id: params.id,
      modificationDate: this.modificationDate,
      rect: this.rectangle,
      subtype: params.subtype,
    };
  }

  /**
   * @private
   */
  _hasFlag(flags, flag) {
    return !!(flags & flag);
  }

  /**
   * @private
   */
  _isViewable(flags) {
    return !this._hasFlag(flags, AnnotationFlag.INVISIBLE) &&
           !this._hasFlag(flags, AnnotationFlag.HIDDEN) &&
           !this._hasFlag(flags, AnnotationFlag.NOVIEW);
  }

  /**
   * @private
   */
  _isPrintable(flags) {
    return this._hasFlag(flags, AnnotationFlag.PRINT) &&
           !this._hasFlag(flags, AnnotationFlag.INVISIBLE) &&
           !this._hasFlag(flags, AnnotationFlag.HIDDEN);
  }

  /**
   * @return {boolean}
   */
  get viewable() {
    if (this.flags === 0) {
      return true;
    }
    return this._isViewable(this.flags);
  }

  /**
   * @return {boolean}
   */
  get printable() {
    if (this.flags === 0) {
      return false;
    }
    return this._isPrintable(this.flags);
  }

  /**
   * Set the contents.
   *
   * @public
   * @memberof Annotation
   * @param {string} contents - Text to display for the annotation or, if the
   *                            type of annotation does not display text, a
   *                            description of the annotation's contents
   */
  setContents(contents) {
    this.contents = stringToPDFString(contents || '');
  }

  /**
   * Set the modification date.
   *
   * @public
   * @memberof Annotation
   * @param {string} modificationDate - PDF date string that indicates when the
   *                                    annotation was last modified
   */
  setModificationDate(modificationDate) {
    this.modificationDate = isString(modificationDate) ?
                            modificationDate : null;
  }

  /**
   * Set the flags.
   *
   * @public
   * @memberof Annotation
   * @param {number} flags - Unsigned 32-bit integer specifying annotation
   *                         characteristics
   * @see {@link shared/util.js}
   */
  setFlags(flags) {
    this.flags = (Number.isInteger(flags) && flags > 0) ? flags : 0;
  }

  /**
   * Check if a provided flag is set.
   *
   * @public
   * @memberof Annotation
   * @param {number} flag - Hexadecimal representation for an annotation
   *                        characteristic
   * @return {boolean}
   * @see {@link shared/util.js}
   */
  hasFlag(flag) {
    return this._hasFlag(this.flags, flag);
  }

  /**
   * Set the rectangle.
   *
   * @public
   * @memberof Annotation
   * @param {Array} rectangle - The rectangle array with exactly four entries
   */
  setRectangle(rectangle) {
    if (Array.isArray(rectangle) && rectangle.length === 4) {
      this.rectangle = Util.normalizeRect(rectangle);
    } else {
      this.rectangle = [0, 0, 0, 0];
    }
  }

  /**
   * Set the color and take care of color space conversion.
   * The default value is black, in RGB color space.
   *
   * @public
   * @memberof Annotation
   * @param {Array} color - The color array containing either 0
   *                        (transparent), 1 (grayscale), 3 (RGB) or
   *                        4 (CMYK) elements
   */
  setColor(color) {
    const rgbColor = new Uint8ClampedArray(3);
    if (!Array.isArray(color)) {
      this.color = rgbColor;
      return;
    }

    switch (color.length) {
      case 0: // Transparent, which we indicate with a null value
        this.color = null;
        break;

      case 1: // Convert grayscale to RGB
        ColorSpace.singletons.gray.getRgbItem(color, 0, rgbColor, 0);
        this.color = rgbColor;
        break;

      case 3: // Convert RGB percentages to RGB
        ColorSpace.singletons.rgb.getRgbItem(color, 0, rgbColor, 0);
        this.color = rgbColor;
        break;

      case 4: // Convert CMYK to RGB
        ColorSpace.singletons.cmyk.getRgbItem(color, 0, rgbColor, 0);
        this.color = rgbColor;
        break;

      default:
        this.color = rgbColor;
        break;
    }
  }

  /**
   * Set the border style (as AnnotationBorderStyle object).
   *
   * @public
   * @memberof Annotation
   * @param {Dict} borderStyle - The border style dictionary
   */
  setBorderStyle(borderStyle) {
    if (typeof PDFJSDev === 'undefined' ||
        PDFJSDev.test('!PRODUCTION || TESTING')) {
      assert(this.rectangle, 'setRectangle must have been called previously.');
    }
    this.borderStyle = new AnnotationBorderStyle();
    if (!isDict(borderStyle)) {
      return;
    }

    // If we have data about "BorderColol aka "BC"
    if (borderStyle.has('MK') && borderStyle.get('MK').has('BC')) {

        this.borderStyle.setColor(borderStyle.get('MK').get('BC'));

        if (borderStyle.has('BS')) {
          const bs = borderStyle.get('BS');
          const dictType = bs.get('Type');

          if (!dictType || isName(dictType, 'Border')) {
            this.borderStyle.setWidth(bs.get('W'), this.rectangle);
            this.borderStyle.setStyle(bs.get('S'));
            this.borderStyle.setDashArray(bs.getArray('D'));
          }
        }

    } else if (borderStyle.has('Border')) {
      const array = borderStyle.getArray('Border');
      if (Array.isArray(array) && array.length >= 3) {
        this.borderStyle.setHorizontalCornerRadius(array[0]);
        this.borderStyle.setVerticalCornerRadius(array[1]);
        this.borderStyle.setWidth(array[2], this.rectangle);

        if (array.length === 4) { // Dash array available
          this.borderStyle.setDashArray(array[3]);
        }
      }
    } else {
      // There are no border entries in the dictionary. According to the
      // specification, we should draw a solid border of width 1 in that
      // case, but Adobe Reader did not implement that part of the
      // specification and instead draws no border at all, so we do the same.
      // See also https://github.com/mozilla/pdf.js/issues/6179.
      this.borderStyle.setWidth(0);
    }
  }

  /**
   * Set the (normal) appearance.
   *
   * @public
   * @memberof Annotation
   * @param {Dict} dict - The annotation's data dictionary
   */
  setAppearance(dict) {
    this.appearance = null;

    const appearanceStates = dict.get('AP');
    if (!isDict(appearanceStates)) {
      return;
    }

    // In case the normal appearance is a stream, then it is used directly.
    const normalAppearanceState = appearanceStates.get('N');
    if (isStream(normalAppearanceState)) {
      this.appearance = normalAppearanceState;
      return;
    }
    if (!isDict(normalAppearanceState)) {
      return;
    }

    // In case the normal appearance is a dictionary, the `AS` entry provides
    // the key of the stream in this dictionary.
    const as = dict.get('AS');
    if (!isName(as) || !normalAppearanceState.has(as.name)) {
      return;
    }
    this.appearance = normalAppearanceState.get(as.name);
  }

  loadResources(keys) {
    return this.appearance.dict.getAsync('Resources').then((resources) => {
      if (!resources) {
        return undefined;
      }

      const objectLoader = new ObjectLoader(resources, keys, resources.xref);
      return objectLoader.load().then(function() {
        return resources;
      });
    });
  }

  getOperatorList(evaluator, task, renderForms) {
    if (!this.appearance) {
      return Promise.resolve(new OperatorList());
    }

    const data = this.data;
    const appearanceDict = this.appearance.dict;
    const resourcesPromise = this.loadResources([
      'ExtGState',
      'ColorSpace',
      'Pattern',
      'Shading',
      'XObject',
      'Font',
    ]);
    const bbox = appearanceDict.getArray('BBox') || [0, 0, 1, 1];
    const matrix = appearanceDict.getArray('Matrix') || [1, 0, 0, 1, 0, 0];
    const transform = getTransformMatrix(data.rect, bbox, matrix);

    return resourcesPromise.then((resources) => {
      const opList = new OperatorList();
      opList.addOp(OPS.beginAnnotation, [data.rect, transform, matrix]);
      return evaluator.getOperatorList({
        stream: this.appearance,
        task,
        resources,
        operatorList: opList,
      }).then(() => {
        opList.addOp(OPS.endAnnotation, []);
        this.appearance.reset();
        return opList;
      });
    });
  }
}

/**
 * Contains all data regarding an annotation's border style.
 */
class AnnotationBorderStyle {
  constructor() {
    this.width = 1;
    this.style = AnnotationBorderStyleType.SOLID;
    this.borderColor = null;
    this.dashArray = [3];
    this.horizontalCornerRadius = 0;
    this.verticalCornerRadius = 0;
  }

  /**
   * Set the width.
   *
   * @public
   * @memberof AnnotationBorderStyle
   * @param {integer} width - The width.
   * @param {Array} rect - The annotation `Rect` entry.
   */
  setWidth(width, rect = [0, 0, 0, 0]) {
    if (typeof PDFJSDev === 'undefined' ||
        PDFJSDev.test('!PRODUCTION || TESTING')) {
      assert(Array.isArray(rect) && rect.length === 4,
             'A valid `rect` parameter must be provided.');
    }

    // Some corrupt PDF generators may provide the width as a `Name`,
    // rather than as a number (fixes issue 10385).
    if (isName(width)) {
      this.width = 0; // This is consistent with the behaviour in Adobe Reader.
      return;
    }
    if (Number.isInteger(width)) {
      if (width > 0) {
        const maxWidth = (rect[2] - rect[0]) / 2;
        const maxHeight = (rect[3] - rect[1]) / 2;

        // Ignore large `width`s, since they lead to the Annotation overflowing
        // the size set by the `Rect` entry thus causing the `annotationLayer`
        // to render it over the surrounding document (fixes bug1552113.pdf).
        if ((maxWidth > 0 && maxHeight > 0) &&
            (width > maxWidth || width > maxHeight)) {
          warn(`AnnotationBorderStyle.setWidth - ignoring width: ${width}`);
          width = 1;
        }
      }
      this.width = width;
    }
  }

  /**
   * Set the style.
   *
   * @public
   * @memberof AnnotationBorderStyle
   * @param {Name} style - The annotation style.
   * @see {@link shared/util.js}
   */
  setStyle(style) {
    if (!isName(style)) {
      return;
    }
    switch (style.name) {
      case 'S':
        this.style = AnnotationBorderStyleType.SOLID;
        break;

      case 'D':
        this.style = AnnotationBorderStyleType.DASHED;
        break;

      case 'B':
        this.style = AnnotationBorderStyleType.BEVELED;
        break;

      case 'I':
        this.style = AnnotationBorderStyleType.INSET;
        break;

      case 'U':
        this.style = AnnotationBorderStyleType.UNDERLINE;
        break;

      default:
        break;
    }
  }

  /**
   * Set the color and take care of color space conversion.
   * The default value is black, in RGB color space.
   *
   * @public
   * @memberof Annotation
   * @param {Array} color - The color array containing either 0
   *                        (transparent), 1 (grayscale), 3 (RGB) or
   *                        4 (CMYK) elements
   */
  setColor(color) {
    const rgbColor = new Uint8ClampedArray(3);
    if (!Array.isArray(color)) {
      this.borderColor = rgbColor;
      return;
    }

    switch (color.length) {
      case 0: // Transparent, which we indicate with a null value
        this.borderColor = null;
        break;

      case 1: // Convert grayscale to RGB
        ColorSpace.singletons.gray.getRgbItem(color, 0, rgbColor, 0);
        this.borderColor = rgbColor;
        break;

      case 3: // Convert RGB percentages to RGB
        ColorSpace.singletons.rgb.getRgbItem(color, 0, rgbColor, 0);
        this.borderColor = rgbColor;
        break;

      case 4: // Convert CMYK to RGB
        ColorSpace.singletons.cmyk.getRgbItem(color, 0, rgbColor, 0);
        this.borderColor = rgbColor;
        break;

      default:
        this.borderColor = rgbColor;
        break;
    }
  }

  /**
   * Set the dash array.
   *
   * @public
   * @memberof AnnotationBorderStyle
   * @param {Array} dashArray - The dash array with at least one element
   */
  setDashArray(dashArray) {
    // We validate the dash array, but we do not use it because CSS does not
    // allow us to change spacing of dashes. For more information, visit
    // http://www.w3.org/TR/css3-background/#the-border-style.
    if (Array.isArray(dashArray) && dashArray.length > 0) {
      // According to the PDF specification: the elements in `dashArray`
      // shall be numbers that are nonnegative and not all equal to zero.
      let isValid = true;
      let allZeros = true;
      for (const element of dashArray) {
        const validNumber = (+element >= 0);
        if (!validNumber) {
          isValid = false;
          break;
        } else if (element > 0) {
          allZeros = false;
        }
      }
      if (isValid && !allZeros) {
        this.dashArray = dashArray;
      } else {
        this.width = 0; // Adobe behavior when the array is invalid.
      }
    } else if (dashArray) {
      this.width = 0; // Adobe behavior when the array is invalid.
    }
  }

  /**
   * Set the horizontal corner radius (from a Border dictionary).
   *
   * @public
   * @memberof AnnotationBorderStyle
   * @param {integer} radius - The horizontal corner radius
   */
  setHorizontalCornerRadius(radius) {
    if (Number.isInteger(radius)) {
      this.horizontalCornerRadius = radius;
    }
  }

  /**
   * Set the vertical corner radius (from a Border dictionary).
   *
   * @public
   * @memberof AnnotationBorderStyle
   * @param {integer} radius - The vertical corner radius
   */
  setVerticalCornerRadius(radius) {
    if (Number.isInteger(radius)) {
      this.verticalCornerRadius = radius;
    }
  }
}

class MarkupAnnotation extends Annotation {
  constructor(parameters) {
    super(parameters);

    const dict = parameters.dict;

    if (dict.has('IRT')) {
      const rawIRT = dict.getRaw('IRT');
      this.data.inReplyTo = isRef(rawIRT) ? rawIRT.toString() : null;

      const rt = dict.get('RT');
      this.data.replyType = isName(rt) ? rt.name : AnnotationReplyType.REPLY;
    }

    if (this.data.replyType === AnnotationReplyType.GROUP) {
      // Subordinate annotations in a group should inherit
      // the group attributes from the primary annotation.
      const parent = dict.get('IRT');

      this.data.title = stringToPDFString(parent.get('T') || '');

      this.setContents(parent.get('Contents'));
      this.data.contents = this.contents;

      if (!parent.has('CreationDate')) {
        this.data.creationDate = null;
      } else {
        this.setCreationDate(parent.get('CreationDate'));
        this.data.creationDate = this.creationDate;
      }

      if (!parent.has('M')) {
        this.data.modificationDate = null;
      } else {
        this.setModificationDate(parent.get('M'));
        this.data.modificationDate = this.modificationDate;
      }

      this.data.hasPopup = parent.has('Popup');

      if (!parent.has('C')) {
        // Fall back to the default background color.
        this.data.color = null;
      } else {
        this.setColor(parent.getArray('C'));
        this.data.color = this.color;
      }
    } else {
      this.data.title = stringToPDFString(dict.get('T') || '');

      this.setCreationDate(dict.get('CreationDate'));
      this.data.creationDate = this.creationDate;

      this.data.hasPopup = dict.has('Popup');

      if (!dict.has('C')) {
        // Fall back to the default background color.
        this.data.color = null;
      }
    }
  }

  /**
   * Set the creation date.
   *
   * @public
   * @memberof MarkupAnnotation
   * @param {string} creationDate - PDF date string that indicates when the
   *                                annotation was originally created
   */
  setCreationDate(creationDate) {
    this.creationDate = isString(creationDate) ? creationDate : null;
  }
}

class WidgetAnnotation extends Annotation {
  constructor(params) {
    super(params);

    const dict = params.dict;
    const data = this.data;

    let fieldName = [];
    let namedItem = dict;
    let ref = params.ref;
    while (namedItem) {
      let parent = namedItem.get('Parent');
      let parentRef = namedItem.getRaw('Parent');
      let name = namedItem.get('T');
      if (name) {
        fieldName.unshift(stringToPDFString(name));
      } else if (parent && ref) {
        // The field name is absent, that means more than one field
        // with the same name may exist. Replacing the empty name
        // with the '`' plus index in the parent's 'Kids' array.
        // This is not in the PDF spec but necessary to id the
        // the input controls.
        let kids = parent.get('Kids');
        let j, jj;
        for (j = 0, jj = kids.length; j < jj; j++) {
          let kidRef = kids[j];
          if (kidRef.num === ref.num && kidRef.gen === ref.gen) {
            break;
          }
        }
        fieldName.unshift('`' + j);
      }
      namedItem = parent;
      ref = parentRef;
    }
    let groupingName = fieldName.join('.');

    data.annotationType = AnnotationType.WIDGET;
    data.fieldName = this._constructFieldName(dict);
    data.fullName = groupingName; // the default
    data.fieldValue = getInheritableProperty({ dict, key: 'V',
                                               getArray: true, });
    data.alternativeText = stringToPDFString(dict.get('TU') || '');
    data.defaultAppearance = getInheritableProperty({ dict, key: 'DA', }) || '';
    const fieldType = getInheritableProperty({ dict, key: 'FT', });
    data.fieldType = isName(fieldType) ? fieldType.name : null;
    this.fieldResources = getInheritableProperty({ dict, key: 'DR', }) ||
                          Dict.empty;

    data.fieldFlags = getInheritableProperty({ dict, key: 'Ff', });
    if (!Number.isInteger(data.fieldFlags) || data.fieldFlags < 0) {
      data.fieldFlags = 0;
    }

    data.action = {
      JS: null,
      JSBl: null,
      JSFo: null,
    };

    let jsA = getInheritableProperty({ dict, key: 'A', });
    let jsAA = getInheritableProperty({ dict, key: 'AA', });
    let js = '';
    // let jsAA = getInheritableProperty({ dict, key: 'AA', });
    // let mouseUp = jsAA;
    if (jsA) {
      /* var JS = (0, _util.stringToPDFString)(jsA.get('JS') || '');
      data.action = {
        JS: JS
      }; */
      const type = jsA.get('S');
      if (isName(type, 'JavaScript')) {

        js = jsA.get('JS');
        if (isStream(js)) {
          js = bytesToString(js.getBytes());
        } /* else if (!isString(js)) {
          return;
        } */

        data.action.JS = js;
      }
    }

    if (jsAA) {
      const bl = jsAA.get('Bl');
      if (bl) {
        const type = bl.get('S');
        if (isName(type, 'JavaScript')) {

          js = bl.get('JS');
          if (isStream(js)) {
            js = bytesToString(js.getBytes());
          } /* else if (!isString(js)) {
            return;
          } */

          data.action.JSBl = js;
        }
      }
      const Fo = jsAA.get('Fo');
      if (Fo) {
        const type = Fo.get('S');
        if (isName(type, 'JavaScript')) {

          js = Fo.get('JS');
          if (isStream(js)) {
            js = bytesToString(js.getBytes());
          } /* else if (!isString(js)) {
            return;
          } */

          data.action.JSFo = js;
        }
      }
      const F = jsAA.get('F');
      if (F) {
        const type = F.get('S');
        if (isName(type, 'JavaScript')) {

          js = F.get('JS');
          if (isStream(js)) {
            js = bytesToString(js.getBytes());
          } /* else if (!isString(js)) {
            return;
          } */

          data.action.JSFormat = js;
        }
      }
      const K = jsAA.get('K');
      if (K) {
        const type = K.get('S');
        if (isName(type, 'JavaScript')) {

          js = K.get('JS');
          if (isStream(js)) {
            js = bytesToString(js.getBytes());
          } /* else if (!isString(js)) {
            return;
          } */

          data.action.JSKeypress = js;
        }
      }
    }
    data.readOnly = this.hasFieldFlag(AnnotationFieldFlag.READONLY);
    data.required = this.hasFieldFlag(AnnotationFieldFlag.REQUIRED);

    // Hide signatures because we cannot validate them, and unset the fieldValue
    // since it's (most likely) a `Dict` which is non-serializable and will thus
    // cause errors when sending annotations to the main-thread (issue 10347).
    if (data.fieldType === 'Sig') {
      data.fieldValue = null;
      this.setFlags(AnnotationFlag.HIDDEN);
    }
  }

  /**
   * Construct the (fully qualified) field name from the (partial) field
   * names of the field and its ancestors.
   *
   * @private
   * @memberof WidgetAnnotation
   * @param {Dict} dict - Complete widget annotation dictionary
   * @return {string}
   */
  _constructFieldName(dict) {
    // Both the `Parent` and `T` fields are optional. While at least one of
    // them should be provided, bad PDF generators may fail to do so.
    if (!dict.has('T') && !dict.has('Parent')) {
      warn('Unknown field name, falling back to empty field name.');
      return '';
    }

    // If no parent exists, the partial and fully qualified names are equal.
    if (!dict.has('Parent')) {
      return stringToPDFString(dict.get('T'));
    }

    // Form the fully qualified field name by appending the partial name to
    // the parent's fully qualified name, separated by a period.
    const fieldName = [];
    if (dict.has('T')) {
      fieldName.unshift(stringToPDFString(dict.get('T')));
    }

    let loopDict = dict;
    while (loopDict.has('Parent')) {
      loopDict = loopDict.get('Parent');
      if (!isDict(loopDict)) {
        // Even though it is not allowed according to the PDF specification,
        // bad PDF generators may provide a `Parent` entry that is not a
        // dictionary, but `null` for example (issue 8143).
        break;
      }

      if (loopDict.has('T')) {
        fieldName.unshift(stringToPDFString(loopDict.get('T')));
      }
    }
    return fieldName.join('.');
  }

  /**
   * Check if a provided field flag is set.
   *
   * @public
   * @memberof WidgetAnnotation
   * @param {number} flag - Hexadecimal representation for an annotation
   *                        field characteristic
   * @return {boolean}
   * @see {@link shared/util.js}
   */
  hasFieldFlag(flag) {
    return !!(this.data.fieldFlags & flag);
  }

  getOperatorList(evaluator, task, renderForms) {
    // Do not render form elements on the canvas when interactive forms are
    // enabled. The display layer is responsible for rendering them instead.
    if (renderForms) {
      return Promise.resolve(new OperatorList());
    }
    return super.getOperatorList(evaluator, task, renderForms);
  }
}

class TextWidgetAnnotation extends WidgetAnnotation {
  constructor(params) {
    super(params);

    const dict = params.dict;

    // The field value is always a string.
    this.data.fieldValue = stringToPDFString(this.data.fieldValue || '');

    // Determine the alignment of text in the field.
    let alignment = getInheritableProperty({ dict, key: 'Q', });
    if (!Number.isInteger(alignment) || alignment < 0 || alignment > 2) {
      alignment = null;
    }
    this.data.textAlignment = alignment;

    // Determine the maximum length of text in the field.
    let maximumLength = getInheritableProperty({ dict, key: 'MaxLen', });
    if (!Number.isInteger(maximumLength) || maximumLength < 0) {
      maximumLength = null;
    }
    this.data.maxLen = maximumLength;

    // Process field flags for the display layer.
    this.data.doNotScroll = this.hasFieldFlag(AnnotationFieldFlag.DONOTSCROLL);
    this.data.multiLine = this.hasFieldFlag(AnnotationFieldFlag.MULTILINE);
    this.data.comb = this.hasFieldFlag(AnnotationFieldFlag.COMB) &&
                     !this.hasFieldFlag(AnnotationFieldFlag.MULTILINE) &&
                     !this.hasFieldFlag(AnnotationFieldFlag.PASSWORD) &&
                     !this.hasFieldFlag(AnnotationFieldFlag.FILESELECT) &&
                     this.data.maxLen !== null;
  }

  getOperatorList(evaluator, task, renderForms) {
    if (renderForms || this.appearance) {
      return super.getOperatorList(evaluator, task, renderForms);
    }

    const operatorList = new OperatorList();

    // Even if there is an appearance stream, ignore it. This is the
    // behaviour used by Adobe Reader.
    if (!this.data.defaultAppearance) {
      return Promise.resolve(operatorList);
    }

    const stream = new Stream(stringToBytes(this.data.defaultAppearance));
    return evaluator.getOperatorList({
      stream,
      task,
      resources: this.fieldResources,
      operatorList,
    }).then(function () {
      return operatorList;
    });
  }
}

class ButtonWidgetAnnotation extends WidgetAnnotation {
  constructor(params) {
    super(params);

    this.data.checkBox = !this.hasFieldFlag(AnnotationFieldFlag.RADIO) &&
                         !this.hasFieldFlag(AnnotationFieldFlag.PUSHBUTTON);
    this.data.radioButton = this.hasFieldFlag(AnnotationFieldFlag.RADIO) &&
                            !this.hasFieldFlag(AnnotationFieldFlag.PUSHBUTTON);
    this.data.pushButton = this.hasFieldFlag(AnnotationFieldFlag.PUSHBUTTON);

    if (this.data.checkBox) {
      this._processCheckBox(params);
    } else if (this.data.radioButton) {
      this._processRadioButton(params);
    } else if (this.data.pushButton) {
      this._processPushButton(params);
    } else {
      warn('Invalid field flags for button widget annotation');
    }
  }

  _processCheckBox(params) {
    if (isName(this.data.fieldValue)) {
      this.data.fieldValue = this.data.fieldValue.name;
    }

    const customAppearance = params.dict.get('AP');
    if (!isDict(customAppearance)) {
      return;
    }

    const exportValueOptionsDict = customAppearance.get('D');
    if (!isDict(exportValueOptionsDict)) {
      return;
    }

    const exportValues = exportValueOptionsDict.getKeys();
    const hasCorrectOptionCount = exportValues.length === 2;
    if (!hasCorrectOptionCount) {
      return;
    }

    this.data.exportValue = exportValues[0] === 'Off' ?
      exportValues[1] : exportValues[0];
  }

  _processRadioButton(params) {
    this.data.fieldValue = this.data.buttonValue = null;

    // The parent field's `V` entry holds a `Name` object with the appearance
    // state of whichever child field is currently in the "on" state.
    const fieldParent = params.dict.get('Parent');
    if (isDict(fieldParent) && fieldParent.has('V')) {
      const fieldParentValue = fieldParent.get('V');
      if (isName(fieldParentValue)) {
        this.data.fieldValue = fieldParentValue.name;
      }
    }

    // The button's value corresponds to its appearance state.
    const appearanceStates = params.dict.get('AP');
    if (!isDict(appearanceStates)) {
      return;
    }
    const normalAppearanceState = appearanceStates.get('N');
    if (!isDict(normalAppearanceState)) {
      return;
    }
    for (const key of normalAppearanceState.getKeys()) {
      if (key !== 'Off') {
        this.data.buttonValue = key;
        break;
      }
    }
  }

  _processPushButton(params) {
    if (!params.dict.has('A')) {
      warn('Push buttons without action dictionaries are not supported');
      return;
    }

    Catalog.parseDestDictionary({
      destDict: params.dict,
      resultObj: this.data,
      docBaseUrl: params.pdfManager.docBaseUrl,
    });
  }
}

class ChoiceWidgetAnnotation extends WidgetAnnotation {
  constructor(params) {
    super(params);

    // Determine the options. The options array may consist of strings or
    // arrays. If the array consists of arrays, then the first element of
    // each array is the export value and the second element of each array is
    // the display value. If the array consists of strings, then these
    // represent both the export and display value. In this case, we convert
    // it to an array of arrays as well for convenience in the display layer.
    // Note that the specification does not state that the `Opt` field is
    // inheritable, but in practice PDF generators do make annotations
    // inherit the options from a parent annotation (issue 8094).
    this.data.options = [];

    const options = getInheritableProperty({ dict: params.dict, key: 'Opt', });
    if (Array.isArray(options)) {
      const xref = params.xref;
      for (let i = 0, ii = options.length; i < ii; i++) {
        let option = xref.fetchIfRef(options[i]);
        let isOptionArray = Array.isArray(option);

        this.data.options[i] = {
          exportValue: isOptionArray ? xref.fetchIfRef(option[0]) : option,
          displayValue: stringToPDFString(isOptionArray ?
                                          xref.fetchIfRef(option[1]) : option),
        };
      }
    }

    // Determine the field value. In this case, it may be a string or an
    // array of strings. For convenience in the display layer, convert the
    // string to an array of one string as well.
    if (!Array.isArray(this.data.fieldValue)) {
      this.data.fieldValue = [this.data.fieldValue];
    }

    // Process field flags for the display layer.
    this.data.combo = this.hasFieldFlag(AnnotationFieldFlag.COMBO);
    this.data.multiSelect = this.hasFieldFlag(AnnotationFieldFlag.MULTISELECT);
  }
}

class TextAnnotation extends MarkupAnnotation {
  constructor(parameters) {
    const DEFAULT_ICON_SIZE = 22; // px

    super(parameters);

    const dict = parameters.dict;
    this.data.annotationType = AnnotationType.TEXT;

    if (this.data.hasAppearance) {
      this.data.name = 'NoIcon';
    } else {
      this.data.rect[1] = this.data.rect[3] - DEFAULT_ICON_SIZE;
      this.data.rect[2] = this.data.rect[0] + DEFAULT_ICON_SIZE;
      this.data.name = dict.has('Name') ?
                       dict.get('Name').name : 'Note';
    }

    if (dict.has('State')) {
      this.data.state = dict.get('State') || null;
      this.data.stateModel = dict.get('StateModel') || null;
    } else {
      this.data.state = null;
      this.data.stateModel = null;
    }
  }
}

class LinkAnnotation extends Annotation {
  constructor(params) {
    super(params);

    this.data.annotationType = AnnotationType.LINK;

    const quadPoints = getQuadPoints(params.dict, this.rectangle);
    if (quadPoints) {
      this.data.quadPoints = quadPoints;
    }

    Catalog.parseDestDictionary({
      destDict: params.dict,
      resultObj: this.data,
      docBaseUrl: params.pdfManager.docBaseUrl,
    });
  }
}

class PopupAnnotation extends Annotation {
  constructor(parameters) {
    super(parameters);

    this.data.annotationType = AnnotationType.POPUP;

    let parentItem = parameters.dict.get('Parent');
    if (!parentItem) {
      warn('Popup annotation has a missing or invalid parent annotation.');
      return;
    }

    const parentSubtype = parentItem.get('Subtype');
    this.data.parentType = isName(parentSubtype) ? parentSubtype.name : null;
    const rawParent = parameters.dict.getRaw('Parent');
    this.data.parentId = isRef(rawParent) ? rawParent.toString() : null;

    const rt = parentItem.get('RT');
    if (isName(rt, AnnotationReplyType.GROUP)) {
      // Subordinate annotations in a group should inherit
      // the group attributes from the primary annotation.
      parentItem = parentItem.get('IRT');
    }

    if (!parentItem.has('M')) {
      this.data.modificationDate = null;
    } else {
      this.setModificationDate(parentItem.get('M'));
      this.data.modificationDate = this.modificationDate;
    }

    if (!parentItem.has('C')) {
      // Fall back to the default background color.
      this.data.color = null;
    } else {
      this.setColor(parentItem.getArray('C'));
      this.data.color = this.color;
    }

    // If the Popup annotation is not viewable, but the parent annotation is,
    // that is most likely a bug. Fallback to inherit the flags from the parent
    // annotation (this is consistent with the behaviour in Adobe Reader).
    if (!this.viewable) {
      const parentFlags = parentItem.get('F');
      if (this._isViewable(parentFlags)) {
        this.setFlags(parentFlags);
      }
    }

    this.data.title = stringToPDFString(parentItem.get('T') || '');
    this.data.contents = stringToPDFString(parentItem.get('Contents') || '');
  }
}

class FreeTextAnnotation extends MarkupAnnotation {
  constructor(parameters) {
    super(parameters);

    this.data.annotationType = AnnotationType.FREETEXT;
  }
}

class LineAnnotation extends MarkupAnnotation {
  constructor(parameters) {
    super(parameters);

    this.data.annotationType = AnnotationType.LINE;

    this.data.lineCoordinates =
      Util.normalizeRect(parameters.dict.getArray('L'));
  }
}

class SquareAnnotation extends MarkupAnnotation {
  constructor(parameters) {
    super(parameters);

    this.data.annotationType = AnnotationType.SQUARE;
  }
}

class CircleAnnotation extends MarkupAnnotation {
  constructor(parameters) {
    super(parameters);

    this.data.annotationType = AnnotationType.CIRCLE;
  }
}

class PolylineAnnotation extends MarkupAnnotation {
  constructor(parameters) {
    super(parameters);

    this.data.annotationType = AnnotationType.POLYLINE;

    // The vertices array is an array of numbers representing the alternating
    // horizontal and vertical coordinates, respectively, of each vertex.
    // Convert this to an array of objects with x and y coordinates.
    const rawVertices = parameters.dict.getArray('Vertices');
    this.data.vertices = [];
    for (let i = 0, ii = rawVertices.length; i < ii; i += 2) {
      this.data.vertices.push({
        x: rawVertices[i],
        y: rawVertices[i + 1],
      });
    }
  }
}

class PolygonAnnotation extends PolylineAnnotation {
  constructor(parameters) {
    // Polygons are specific forms of polylines, so reuse their logic.
    super(parameters);

    this.data.annotationType = AnnotationType.POLYGON;
  }
}

class CaretAnnotation extends MarkupAnnotation {
  constructor(parameters) {
    super(parameters);

    this.data.annotationType = AnnotationType.CARET;
  }
}

class InkAnnotation extends MarkupAnnotation {
  constructor(parameters) {
    super(parameters);

    this.data.annotationType = AnnotationType.INK;

    const xref = parameters.xref;
    const originalInkLists = parameters.dict.getArray('InkList');
    this.data.inkLists = [];
    for (let i = 0, ii = originalInkLists.length; i < ii; ++i) {
      // The raw ink lists array contains arrays of numbers representing
      // the alternating horizontal and vertical coordinates, respectively,
      // of each vertex. Convert this to an array of objects with x and y
      // coordinates.
      this.data.inkLists.push([]);
      for (let j = 0, jj = originalInkLists[i].length; j < jj; j += 2) {
        this.data.inkLists[i].push({
          x: xref.fetchIfRef(originalInkLists[i][j]),
          y: xref.fetchIfRef(originalInkLists[i][j + 1]),
        });
      }
    }
  }
}

class HighlightAnnotation extends MarkupAnnotation {
  constructor(parameters) {
    super(parameters);

    this.data.annotationType = AnnotationType.HIGHLIGHT;

    const quadPoints = getQuadPoints(parameters.dict, this.rectangle);
    if (quadPoints) {
      this.data.quadPoints = quadPoints;
    }
  }
}

class UnderlineAnnotation extends MarkupAnnotation {
  constructor(parameters) {
    super(parameters);

    this.data.annotationType = AnnotationType.UNDERLINE;

    const quadPoints = getQuadPoints(parameters.dict, this.rectangle);
    if (quadPoints) {
      this.data.quadPoints = quadPoints;
    }
  }
}

class SquigglyAnnotation extends MarkupAnnotation {
  constructor(parameters) {
    super(parameters);

    this.data.annotationType = AnnotationType.SQUIGGLY;

    const quadPoints = getQuadPoints(parameters.dict, this.rectangle);
    if (quadPoints) {
      this.data.quadPoints = quadPoints;
    }
  }
}

class StrikeOutAnnotation extends MarkupAnnotation {
  constructor(parameters) {
    super(parameters);

    this.data.annotationType = AnnotationType.STRIKEOUT;

    const quadPoints = getQuadPoints(parameters.dict, this.rectangle);
    if (quadPoints) {
      this.data.quadPoints = quadPoints;
    }
  }
}

class StampAnnotation extends MarkupAnnotation {
  constructor(parameters) {
    super(parameters);

    this.data.annotationType = AnnotationType.STAMP;
  }
}

class FileAttachmentAnnotation extends MarkupAnnotation {
  constructor(parameters) {
    super(parameters);

    const file = new FileSpec(parameters.dict.get('FS'), parameters.xref);

    this.data.annotationType = AnnotationType.FILEATTACHMENT;
    this.data.file = file.serializable;
  }
}

export {
  Annotation,
  AnnotationBorderStyle,
  AnnotationFactory,
  MarkupAnnotation,
  getQuadPoints,
};
