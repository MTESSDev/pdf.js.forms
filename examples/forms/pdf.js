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
(function (root, factory) {
 'use strict';
 if (typeof define === 'function' && define.amd) {
  define('pdfjs-dist/build/pdf', ['exports'], factory);
 } else if (typeof exports !== 'undefined') {
  factory(exports);
 } else {
  factory(root['pdfjsDistBuildPdf'] = {});
 }
}(this, function (exports) {
 'use strict';
 var pdfjsVersion = '1.6.52';
 var pdfjsBuild = 'a44040b';
 var pdfjsFilePath = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : null;
 var pdfjsLibs = {};
 (function pdfjsWrapper() {
  (function (root, factory) {
   factory(root.pdfjsSharedUtil = {});
  }(this, function (exports) {
   var globalScope = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this;
   var FONT_IDENTITY_MATRIX = [
    0.001,
    0,
    0,
    0.001,
    0,
    0
   ];
   var TextRenderingMode = {
    FILL: 0,
    STROKE: 1,
    FILL_STROKE: 2,
    INVISIBLE: 3,
    FILL_ADD_TO_PATH: 4,
    STROKE_ADD_TO_PATH: 5,
    FILL_STROKE_ADD_TO_PATH: 6,
    ADD_TO_PATH: 7,
    FILL_STROKE_MASK: 3,
    ADD_TO_PATH_FLAG: 4
   };
   var ImageKind = {
    GRAYSCALE_1BPP: 1,
    RGB_24BPP: 2,
    RGBA_32BPP: 3
   };
   var AnnotationType = {
    TEXT: 1,
    LINK: 2,
    FREETEXT: 3,
    LINE: 4,
    SQUARE: 5,
    CIRCLE: 6,
    POLYGON: 7,
    POLYLINE: 8,
    HIGHLIGHT: 9,
    UNDERLINE: 10,
    SQUIGGLY: 11,
    STRIKEOUT: 12,
    STAMP: 13,
    CARET: 14,
    INK: 15,
    POPUP: 16,
    FILEATTACHMENT: 17,
    SOUND: 18,
    MOVIE: 19,
    WIDGET: 20,
    SCREEN: 21,
    PRINTERMARK: 22,
    TRAPNET: 23,
    WATERMARK: 24,
    THREED: 25,
    REDACT: 26
   };
   var AnnotationFlag = {
    INVISIBLE: 0x01,
    HIDDEN: 0x02,
    PRINT: 0x04,
    NOZOOM: 0x08,
    NOROTATE: 0x10,
    NOVIEW: 0x20,
    READONLY: 0x40,
    LOCKED: 0x80,
    TOGGLENOVIEW: 0x100,
    LOCKEDCONTENTS: 0x200
   };
   var AnnotationFieldFlag = {
    READONLY: 0x0000001,
    REQUIRED: 0x0000002,
    NOEXPORT: 0x0000004,
    MULTILINE: 0x0001000,
    PASSWORD: 0x0002000,
    NOTOGGLETOOFF: 0x0004000,
    RADIO: 0x0008000,
    PUSHBUTTON: 0x0010000,
    COMBO: 0x0020000,
    EDIT: 0x0040000,
    SORT: 0x0080000,
    FILESELECT: 0x0100000,
    MULTISELECT: 0x0200000,
    DONOTSPELLCHECK: 0x0400000,
    DONOTSCROLL: 0x0800000,
    COMB: 0x1000000,
    RICHTEXT: 0x2000000,
    RADIOSINUNISON: 0x2000000,
    COMMITONSELCHANGE: 0x4000000
   };
   var AnnotationBorderStyleType = {
    SOLID: 1,
    DASHED: 2,
    BEVELED: 3,
    INSET: 4,
    UNDERLINE: 5
   };
   var StreamType = {
    UNKNOWN: 0,
    FLATE: 1,
    LZW: 2,
    DCT: 3,
    JPX: 4,
    JBIG: 5,
    A85: 6,
    AHX: 7,
    CCF: 8,
    RL: 9
   };
   var FontType = {
    UNKNOWN: 0,
    TYPE1: 1,
    TYPE1C: 2,
    CIDFONTTYPE0: 3,
    CIDFONTTYPE0C: 4,
    TRUETYPE: 5,
    CIDFONTTYPE2: 6,
    TYPE3: 7,
    OPENTYPE: 8,
    TYPE0: 9,
    MMTYPE1: 10
   };
   var VERBOSITY_LEVELS = {
    errors: 0,
    warnings: 1,
    infos: 5
   };
   var OPS = {
    dependency: 1,
    setLineWidth: 2,
    setLineCap: 3,
    setLineJoin: 4,
    setMiterLimit: 5,
    setDash: 6,
    setRenderingIntent: 7,
    setFlatness: 8,
    setGState: 9,
    save: 10,
    restore: 11,
    transform: 12,
    moveTo: 13,
    lineTo: 14,
    curveTo: 15,
    curveTo2: 16,
    curveTo3: 17,
    closePath: 18,
    rectangle: 19,
    stroke: 20,
    closeStroke: 21,
    fill: 22,
    eoFill: 23,
    fillStroke: 24,
    eoFillStroke: 25,
    closeFillStroke: 26,
    closeEOFillStroke: 27,
    endPath: 28,
    clip: 29,
    eoClip: 30,
    beginText: 31,
    endText: 32,
    setCharSpacing: 33,
    setWordSpacing: 34,
    setHScale: 35,
    setLeading: 36,
    setFont: 37,
    setTextRenderingMode: 38,
    setTextRise: 39,
    moveText: 40,
    setLeadingMoveText: 41,
    setTextMatrix: 42,
    nextLine: 43,
    showText: 44,
    showSpacedText: 45,
    nextLineShowText: 46,
    nextLineSetSpacingShowText: 47,
    setCharWidth: 48,
    setCharWidthAndBounds: 49,
    setStrokeColorSpace: 50,
    setFillColorSpace: 51,
    setStrokeColor: 52,
    setStrokeColorN: 53,
    setFillColor: 54,
    setFillColorN: 55,
    setStrokeGray: 56,
    setFillGray: 57,
    setStrokeRGBColor: 58,
    setFillRGBColor: 59,
    setStrokeCMYKColor: 60,
    setFillCMYKColor: 61,
    shadingFill: 62,
    beginInlineImage: 63,
    beginImageData: 64,
    endInlineImage: 65,
    paintXObject: 66,
    markPoint: 67,
    markPointProps: 68,
    beginMarkedContent: 69,
    beginMarkedContentProps: 70,
    endMarkedContent: 71,
    beginCompat: 72,
    endCompat: 73,
    paintFormXObjectBegin: 74,
    paintFormXObjectEnd: 75,
    beginGroup: 76,
    endGroup: 77,
    beginAnnotations: 78,
    endAnnotations: 79,
    beginAnnotation: 80,
    endAnnotation: 81,
    paintJpegXObject: 82,
    paintImageMaskXObject: 83,
    paintImageMaskXObjectGroup: 84,
    paintImageXObject: 85,
    paintInlineImageXObject: 86,
    paintInlineImageXObjectGroup: 87,
    paintImageXObjectRepeat: 88,
    paintImageMaskXObjectRepeat: 89,
    paintSolidColorImageMask: 90,
    constructPath: 91
   };
   var verbosity = VERBOSITY_LEVELS.warnings;
   function setVerbosityLevel(level) {
    verbosity = level;
   }
   function getVerbosityLevel() {
    return verbosity;
   }
   function info(msg) {
    if (verbosity >= VERBOSITY_LEVELS.infos) {
     console.log('Info: ' + msg);
    }
   }
   function warn(msg) {
    if (verbosity >= VERBOSITY_LEVELS.warnings) {
     console.log('Warning: ' + msg);
    }
   }
   function deprecated(details) {
    console.log('Deprecated API usage: ' + details);
   }
   function error(msg) {
    if (verbosity >= VERBOSITY_LEVELS.errors) {
     console.log('Error: ' + msg);
     console.log(backtrace());
    }
    throw new Error(msg);
   }
   function backtrace() {
    try {
     throw new Error();
    } catch (e) {
     return e.stack ? e.stack.split('\n').slice(2).join('\n') : '';
    }
   }
   function assert(cond, msg) {
    if (!cond) {
     error(msg);
    }
   }
   var UNSUPPORTED_FEATURES = {
    unknown: 'unknown',
    forms: 'forms',
    javaScript: 'javaScript',
    smask: 'smask',
    shadingPattern: 'shadingPattern',
    font: 'font'
   };
   function isSameOrigin(baseUrl, otherUrl) {
    try {
     var base = new URL(baseUrl);
     if (!base.origin || base.origin === 'null') {
      return false;
     }
    } catch (e) {
     return false;
    }
    var other = new URL(otherUrl, base);
    return base.origin === other.origin;
   }
   function isValidProtocol(url) {
    if (!url) {
     return false;
    }
    switch (url.protocol) {
    case 'http:':
    case 'https:':
    case 'ftp:':
    case 'mailto:':
    case 'tel:':
     return true;
    default:
     return false;
    }
   }
   function createValidAbsoluteUrl(url, baseUrl) {
    if (!url) {
     return null;
    }
    try {
     var absoluteUrl = baseUrl ? new URL(url, baseUrl) : new URL(url);
     if (isValidProtocol(absoluteUrl)) {
      return absoluteUrl;
     }
    } catch (ex) {
    }
    return null;
   }
   function shadow(obj, prop, value) {
    Object.defineProperty(obj, prop, {
     value: value,
     enumerable: true,
     configurable: true,
     writable: false
    });
    return value;
   }
   function getLookupTableFactory(initializer) {
    var lookup;
    return function () {
     if (initializer) {
      lookup = Object.create(null);
      initializer(lookup);
      initializer = null;
     }
     return lookup;
    };
   }
   var PasswordResponses = {
    NEED_PASSWORD: 1,
    INCORRECT_PASSWORD: 2
   };
   var PasswordException = function PasswordExceptionClosure() {
    function PasswordException(msg, code) {
     this.name = 'PasswordException';
     this.message = msg;
     this.code = code;
    }
    PasswordException.prototype = new Error();
    PasswordException.constructor = PasswordException;
    return PasswordException;
   }();
   var UnknownErrorException = function UnknownErrorExceptionClosure() {
    function UnknownErrorException(msg, details) {
     this.name = 'UnknownErrorException';
     this.message = msg;
     this.details = details;
    }
    UnknownErrorException.prototype = new Error();
    UnknownErrorException.constructor = UnknownErrorException;
    return UnknownErrorException;
   }();
   var InvalidPDFException = function InvalidPDFExceptionClosure() {
    function InvalidPDFException(msg) {
     this.name = 'InvalidPDFException';
     this.message = msg;
    }
    InvalidPDFException.prototype = new Error();
    InvalidPDFException.constructor = InvalidPDFException;
    return InvalidPDFException;
   }();
   var MissingPDFException = function MissingPDFExceptionClosure() {
    function MissingPDFException(msg) {
     this.name = 'MissingPDFException';
     this.message = msg;
    }
    MissingPDFException.prototype = new Error();
    MissingPDFException.constructor = MissingPDFException;
    return MissingPDFException;
   }();
   var UnexpectedResponseException = function UnexpectedResponseExceptionClosure() {
    function UnexpectedResponseException(msg, status) {
     this.name = 'UnexpectedResponseException';
     this.message = msg;
     this.status = status;
    }
    UnexpectedResponseException.prototype = new Error();
    UnexpectedResponseException.constructor = UnexpectedResponseException;
    return UnexpectedResponseException;
   }();
   var NotImplementedException = function NotImplementedExceptionClosure() {
    function NotImplementedException(msg) {
     this.message = msg;
    }
    NotImplementedException.prototype = new Error();
    NotImplementedException.prototype.name = 'NotImplementedException';
    NotImplementedException.constructor = NotImplementedException;
    return NotImplementedException;
   }();
   var MissingDataException = function MissingDataExceptionClosure() {
    function MissingDataException(begin, end) {
     this.begin = begin;
     this.end = end;
     this.message = 'Missing data [' + begin + ', ' + end + ')';
    }
    MissingDataException.prototype = new Error();
    MissingDataException.prototype.name = 'MissingDataException';
    MissingDataException.constructor = MissingDataException;
    return MissingDataException;
   }();
   var XRefParseException = function XRefParseExceptionClosure() {
    function XRefParseException(msg) {
     this.message = msg;
    }
    XRefParseException.prototype = new Error();
    XRefParseException.prototype.name = 'XRefParseException';
    XRefParseException.constructor = XRefParseException;
    return XRefParseException;
   }();
   var NullCharactersRegExp = /\x00/g;
   function removeNullCharacters(str) {
    if (typeof str !== 'string') {
     warn('The argument for removeNullCharacters must be a string.');
     return str;
    }
    return str.replace(NullCharactersRegExp, '');
   }
   function bytesToString(bytes) {
    assert(bytes !== null && typeof bytes === 'object' && bytes.length !== undefined, 'Invalid argument for bytesToString');
    var length = bytes.length;
    var MAX_ARGUMENT_COUNT = 8192;
    if (length < MAX_ARGUMENT_COUNT) {
     return String.fromCharCode.apply(null, bytes);
    }
    var strBuf = [];
    for (var i = 0; i < length; i += MAX_ARGUMENT_COUNT) {
     var chunkEnd = Math.min(i + MAX_ARGUMENT_COUNT, length);
     var chunk = bytes.subarray(i, chunkEnd);
     strBuf.push(String.fromCharCode.apply(null, chunk));
    }
    return strBuf.join('');
   }
   function stringToBytes(str) {
    assert(typeof str === 'string', 'Invalid argument for stringToBytes');
    var length = str.length;
    var bytes = new Uint8Array(length);
    for (var i = 0; i < length; ++i) {
     bytes[i] = str.charCodeAt(i) & 0xFF;
    }
    return bytes;
   }
   function arrayByteLength(arr) {
    if (arr.length !== undefined) {
     return arr.length;
    }
    assert(arr.byteLength !== undefined);
    return arr.byteLength;
   }
   function arraysToBytes(arr) {
    if (arr.length === 1 && arr[0] instanceof Uint8Array) {
     return arr[0];
    }
    var resultLength = 0;
    var i, ii = arr.length;
    var item, itemLength;
    for (i = 0; i < ii; i++) {
     item = arr[i];
     itemLength = arrayByteLength(item);
     resultLength += itemLength;
    }
    var pos = 0;
    var data = new Uint8Array(resultLength);
    for (i = 0; i < ii; i++) {
     item = arr[i];
     if (!(item instanceof Uint8Array)) {
      if (typeof item === 'string') {
       item = stringToBytes(item);
      } else {
       item = new Uint8Array(item);
      }
     }
     itemLength = item.byteLength;
     data.set(item, pos);
     pos += itemLength;
    }
    return data;
   }
   function string32(value) {
    return String.fromCharCode(value >> 24 & 0xff, value >> 16 & 0xff, value >> 8 & 0xff, value & 0xff);
   }
   function log2(x) {
    var n = 1, i = 0;
    while (x > n) {
     n <<= 1;
     i++;
    }
    return i;
   }
   function readInt8(data, start) {
    return data[start] << 24 >> 24;
   }
   function readUint16(data, offset) {
    return data[offset] << 8 | data[offset + 1];
   }
   function readUint32(data, offset) {
    return (data[offset] << 24 | data[offset + 1] << 16 | data[offset + 2] << 8 | data[offset + 3]) >>> 0;
   }
   function isLittleEndian() {
    var buffer8 = new Uint8Array(2);
    buffer8[0] = 1;
    var buffer16 = new Uint16Array(buffer8.buffer);
    return buffer16[0] === 1;
   }
   function isEvalSupported() {
    try {
     new Function('');
     return true;
    } catch (e) {
     return false;
    }
   }
   var Uint32ArrayView = function Uint32ArrayViewClosure() {
    function Uint32ArrayView(buffer, length) {
     this.buffer = buffer;
     this.byteLength = buffer.length;
     this.length = length === undefined ? this.byteLength >> 2 : length;
     ensureUint32ArrayViewProps(this.length);
    }
    Uint32ArrayView.prototype = Object.create(null);
    var uint32ArrayViewSetters = 0;
    function createUint32ArrayProp(index) {
     return {
      get: function () {
       var buffer = this.buffer, offset = index << 2;
       return (buffer[offset] | buffer[offset + 1] << 8 | buffer[offset + 2] << 16 | buffer[offset + 3] << 24) >>> 0;
      },
      set: function (value) {
       var buffer = this.buffer, offset = index << 2;
       buffer[offset] = value & 255;
       buffer[offset + 1] = value >> 8 & 255;
       buffer[offset + 2] = value >> 16 & 255;
       buffer[offset + 3] = value >>> 24 & 255;
      }
     };
    }
    function ensureUint32ArrayViewProps(length) {
     while (uint32ArrayViewSetters < length) {
      Object.defineProperty(Uint32ArrayView.prototype, uint32ArrayViewSetters, createUint32ArrayProp(uint32ArrayViewSetters));
      uint32ArrayViewSetters++;
     }
    }
    return Uint32ArrayView;
   }();
   exports.Uint32ArrayView = Uint32ArrayView;
   var IDENTITY_MATRIX = [
    1,
    0,
    0,
    1,
    0,
    0
   ];
   var Util = function UtilClosure() {
    function Util() {
    }
    var rgbBuf = [
     'rgb(',
     0,
     ',',
     0,
     ',',
     0,
     ')'
    ];
    Util.makeCssRgb = function Util_makeCssRgb(r, g, b) {
     rgbBuf[1] = r;
     rgbBuf[3] = g;
     rgbBuf[5] = b;
     return rgbBuf.join('');
    };
    Util.transform = function Util_transform(m1, m2) {
     return [
      m1[0] * m2[0] + m1[2] * m2[1],
      m1[1] * m2[0] + m1[3] * m2[1],
      m1[0] * m2[2] + m1[2] * m2[3],
      m1[1] * m2[2] + m1[3] * m2[3],
      m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
      m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
     ];
    };
    Util.applyTransform = function Util_applyTransform(p, m) {
     var xt = p[0] * m[0] + p[1] * m[2] + m[4];
     var yt = p[0] * m[1] + p[1] * m[3] + m[5];
     return [
      xt,
      yt
     ];
    };
    Util.applyInverseTransform = function Util_applyInverseTransform(p, m) {
     var d = m[0] * m[3] - m[1] * m[2];
     var xt = (p[0] * m[3] - p[1] * m[2] + m[2] * m[5] - m[4] * m[3]) / d;
     var yt = (-p[0] * m[1] + p[1] * m[0] + m[4] * m[1] - m[5] * m[0]) / d;
     return [
      xt,
      yt
     ];
    };
    Util.getAxialAlignedBoundingBox = function Util_getAxialAlignedBoundingBox(r, m) {
     var p1 = Util.applyTransform(r, m);
     var p2 = Util.applyTransform(r.slice(2, 4), m);
     var p3 = Util.applyTransform([
      r[0],
      r[3]
     ], m);
     var p4 = Util.applyTransform([
      r[2],
      r[1]
     ], m);
     return [
      Math.min(p1[0], p2[0], p3[0], p4[0]),
      Math.min(p1[1], p2[1], p3[1], p4[1]),
      Math.max(p1[0], p2[0], p3[0], p4[0]),
      Math.max(p1[1], p2[1], p3[1], p4[1])
     ];
    };
    Util.inverseTransform = function Util_inverseTransform(m) {
     var d = m[0] * m[3] - m[1] * m[2];
     return [
      m[3] / d,
      -m[1] / d,
      -m[2] / d,
      m[0] / d,
      (m[2] * m[5] - m[4] * m[3]) / d,
      (m[4] * m[1] - m[5] * m[0]) / d
     ];
    };
    Util.apply3dTransform = function Util_apply3dTransform(m, v) {
     return [
      m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
      m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
      m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
     ];
    };
    Util.singularValueDecompose2dScale = function Util_singularValueDecompose2dScale(m) {
     var transpose = [
      m[0],
      m[2],
      m[1],
      m[3]
     ];
     var a = m[0] * transpose[0] + m[1] * transpose[2];
     var b = m[0] * transpose[1] + m[1] * transpose[3];
     var c = m[2] * transpose[0] + m[3] * transpose[2];
     var d = m[2] * transpose[1] + m[3] * transpose[3];
     var first = (a + d) / 2;
     var second = Math.sqrt((a + d) * (a + d) - 4 * (a * d - c * b)) / 2;
     var sx = first + second || 1;
     var sy = first - second || 1;
     return [
      Math.sqrt(sx),
      Math.sqrt(sy)
     ];
    };
    Util.normalizeRect = function Util_normalizeRect(rect) {
     var r = rect.slice(0);
     if (rect[0] > rect[2]) {
      r[0] = rect[2];
      r[2] = rect[0];
     }
     if (rect[1] > rect[3]) {
      r[1] = rect[3];
      r[3] = rect[1];
     }
     return r;
    };
    Util.intersect = function Util_intersect(rect1, rect2) {
     function compare(a, b) {
      return a - b;
     }
     var orderedX = [
       rect1[0],
       rect1[2],
       rect2[0],
       rect2[2]
      ].sort(compare), orderedY = [
       rect1[1],
       rect1[3],
       rect2[1],
       rect2[3]
      ].sort(compare), result = [];
     rect1 = Util.normalizeRect(rect1);
     rect2 = Util.normalizeRect(rect2);
     if (orderedX[0] === rect1[0] && orderedX[1] === rect2[0] || orderedX[0] === rect2[0] && orderedX[1] === rect1[0]) {
      result[0] = orderedX[1];
      result[2] = orderedX[2];
     } else {
      return false;
     }
     if (orderedY[0] === rect1[1] && orderedY[1] === rect2[1] || orderedY[0] === rect2[1] && orderedY[1] === rect1[1]) {
      result[1] = orderedY[1];
      result[3] = orderedY[2];
     } else {
      return false;
     }
     return result;
    };
    Util.sign = function Util_sign(num) {
     return num < 0 ? -1 : 1;
    };
    var ROMAN_NUMBER_MAP = [
     '',
     'C',
     'CC',
     'CCC',
     'CD',
     'D',
     'DC',
     'DCC',
     'DCCC',
     'CM',
     '',
     'X',
     'XX',
     'XXX',
     'XL',
     'L',
     'LX',
     'LXX',
     'LXXX',
     'XC',
     '',
     'I',
     'II',
     'III',
     'IV',
     'V',
     'VI',
     'VII',
     'VIII',
     'IX'
    ];
    Util.toRoman = function Util_toRoman(number, lowerCase) {
     assert(isInt(number) && number > 0, 'The number should be a positive integer.');
     var pos, romanBuf = [];
     while (number >= 1000) {
      number -= 1000;
      romanBuf.push('M');
     }
     pos = number / 100 | 0;
     number %= 100;
     romanBuf.push(ROMAN_NUMBER_MAP[pos]);
     pos = number / 10 | 0;
     number %= 10;
     romanBuf.push(ROMAN_NUMBER_MAP[10 + pos]);
     romanBuf.push(ROMAN_NUMBER_MAP[20 + number]);
     var romanStr = romanBuf.join('');
     return lowerCase ? romanStr.toLowerCase() : romanStr;
    };
    Util.appendToArray = function Util_appendToArray(arr1, arr2) {
     Array.prototype.push.apply(arr1, arr2);
    };
    Util.prependToArray = function Util_prependToArray(arr1, arr2) {
     Array.prototype.unshift.apply(arr1, arr2);
    };
    Util.extendObj = function extendObj(obj1, obj2) {
     for (var key in obj2) {
      obj1[key] = obj2[key];
     }
    };
    Util.getInheritableProperty = function Util_getInheritableProperty(dict, name, getArray) {
     while (dict && !dict.has(name)) {
      dict = dict.get('Parent');
     }
     if (!dict) {
      return null;
     }
     return getArray ? dict.getArray(name) : dict.get(name);
    };
    Util.inherit = function Util_inherit(sub, base, prototype) {
     sub.prototype = Object.create(base.prototype);
     sub.prototype.constructor = sub;
     for (var prop in prototype) {
      sub.prototype[prop] = prototype[prop];
     }
    };
    Util.loadScript = function Util_loadScript(src, callback) {
     var script = document.createElement('script');
     var loaded = false;
     script.setAttribute('src', src);
     if (callback) {
      script.onload = function () {
       if (!loaded) {
        callback();
       }
       loaded = true;
      };
     }
     document.getElementsByTagName('head')[0].appendChild(script);
    };
    return Util;
   }();
   var PageViewport = function PageViewportClosure() {
    function PageViewport(viewBox, scale, rotation, offsetX, offsetY, dontFlip) {
     this.viewBox = viewBox;
     this.scale = scale;
     this.rotation = rotation;
     this.offsetX = offsetX;
     this.offsetY = offsetY;
     var centerX = (viewBox[2] + viewBox[0]) / 2;
     var centerY = (viewBox[3] + viewBox[1]) / 2;
     var rotateA, rotateB, rotateC, rotateD;
     rotation = rotation % 360;
     rotation = rotation < 0 ? rotation + 360 : rotation;
     switch (rotation) {
     case 180:
      rotateA = -1;
      rotateB = 0;
      rotateC = 0;
      rotateD = 1;
      break;
     case 90:
      rotateA = 0;
      rotateB = 1;
      rotateC = 1;
      rotateD = 0;
      break;
     case 270:
      rotateA = 0;
      rotateB = -1;
      rotateC = -1;
      rotateD = 0;
      break;
     default:
      rotateA = 1;
      rotateB = 0;
      rotateC = 0;
      rotateD = -1;
      break;
     }
     if (dontFlip) {
      rotateC = -rotateC;
      rotateD = -rotateD;
     }
     var offsetCanvasX, offsetCanvasY;
     var width, height;
     if (rotateA === 0) {
      offsetCanvasX = Math.abs(centerY - viewBox[1]) * scale + offsetX;
      offsetCanvasY = Math.abs(centerX - viewBox[0]) * scale + offsetY;
      width = Math.abs(viewBox[3] - viewBox[1]) * scale;
      height = Math.abs(viewBox[2] - viewBox[0]) * scale;
     } else {
      offsetCanvasX = Math.abs(centerX - viewBox[0]) * scale + offsetX;
      offsetCanvasY = Math.abs(centerY - viewBox[1]) * scale + offsetY;
      width = Math.abs(viewBox[2] - viewBox[0]) * scale;
      height = Math.abs(viewBox[3] - viewBox[1]) * scale;
     }
     this.transform = [
      rotateA * scale,
      rotateB * scale,
      rotateC * scale,
      rotateD * scale,
      offsetCanvasX - rotateA * scale * centerX - rotateC * scale * centerY,
      offsetCanvasY - rotateB * scale * centerX - rotateD * scale * centerY
     ];
     this.width = width;
     this.height = height;
     this.fontScale = scale;
    }
    PageViewport.prototype = {
     clone: function PageViewPort_clone(args) {
      args = args || {};
      var scale = 'scale' in args ? args.scale : this.scale;
      var rotation = 'rotation' in args ? args.rotation : this.rotation;
      return new PageViewport(this.viewBox.slice(), scale, rotation, this.offsetX, this.offsetY, args.dontFlip);
     },
     convertToViewportPoint: function PageViewport_convertToViewportPoint(x, y) {
      return Util.applyTransform([
       x,
       y
      ], this.transform);
     },
     convertToViewportRectangle: function PageViewport_convertToViewportRectangle(rect) {
      var tl = Util.applyTransform([
       rect[0],
       rect[1]
      ], this.transform);
      var br = Util.applyTransform([
       rect[2],
       rect[3]
      ], this.transform);
      return [
       tl[0],
       tl[1],
       br[0],
       br[1]
      ];
     },
     convertToPdfPoint: function PageViewport_convertToPdfPoint(x, y) {
      return Util.applyInverseTransform([
       x,
       y
      ], this.transform);
     }
    };
    return PageViewport;
   }();
   var PDFStringTranslateTable = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0x2D8,
    0x2C7,
    0x2C6,
    0x2D9,
    0x2DD,
    0x2DB,
    0x2DA,
    0x2DC,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0x2022,
    0x2020,
    0x2021,
    0x2026,
    0x2014,
    0x2013,
    0x192,
    0x2044,
    0x2039,
    0x203A,
    0x2212,
    0x2030,
    0x201E,
    0x201C,
    0x201D,
    0x2018,
    0x2019,
    0x201A,
    0x2122,
    0xFB01,
    0xFB02,
    0x141,
    0x152,
    0x160,
    0x178,
    0x17D,
    0x131,
    0x142,
    0x153,
    0x161,
    0x17E,
    0,
    0x20AC
   ];
   function stringToPDFString(str) {
    var i, n = str.length, strBuf = [];
    if (str[0] === '\xFE' && str[1] === '\xFF') {
     for (i = 2; i < n; i += 2) {
      strBuf.push(String.fromCharCode(str.charCodeAt(i) << 8 | str.charCodeAt(i + 1)));
     }
    } else {
     for (i = 0; i < n; ++i) {
      var code = PDFStringTranslateTable[str.charCodeAt(i)];
      strBuf.push(code ? String.fromCharCode(code) : str.charAt(i));
     }
    }
    return strBuf.join('');
   }
   function stringToUTF8String(str) {
    return decodeURIComponent(escape(str));
   }
   function utf8StringToString(str) {
    return unescape(encodeURIComponent(str));
   }
   function isEmptyObj(obj) {
    for (var key in obj) {
     return false;
    }
    return true;
   }
   function isBool(v) {
    return typeof v === 'boolean';
   }
   function isInt(v) {
    return typeof v === 'number' && (v | 0) === v;
   }
   function isNum(v) {
    return typeof v === 'number';
   }
   function isString(v) {
    return typeof v === 'string';
   }
   function isArray(v) {
    return v instanceof Array;
   }
   function isArrayBuffer(v) {
    return typeof v === 'object' && v !== null && v.byteLength !== undefined;
   }
   function isSpace(ch) {
    return ch === 0x20 || ch === 0x09 || ch === 0x0D || ch === 0x0A;
   }
   function createPromiseCapability() {
    var capability = {};
    capability.promise = new Promise(function (resolve, reject) {
     capability.resolve = resolve;
     capability.reject = reject;
    });
    return capability;
   }
   (function PromiseClosure() {
    if (globalScope.Promise) {
     if (typeof globalScope.Promise.all !== 'function') {
      globalScope.Promise.all = function (iterable) {
       var count = 0, results = [], resolve, reject;
       var promise = new globalScope.Promise(function (resolve_, reject_) {
        resolve = resolve_;
        reject = reject_;
       });
       iterable.forEach(function (p, i) {
        count++;
        p.then(function (result) {
         results[i] = result;
         count--;
         if (count === 0) {
          resolve(results);
         }
        }, reject);
       });
       if (count === 0) {
        resolve(results);
       }
       return promise;
      };
     }
     if (typeof globalScope.Promise.resolve !== 'function') {
      globalScope.Promise.resolve = function (value) {
       return new globalScope.Promise(function (resolve) {
        resolve(value);
       });
      };
     }
     if (typeof globalScope.Promise.reject !== 'function') {
      globalScope.Promise.reject = function (reason) {
       return new globalScope.Promise(function (resolve, reject) {
        reject(reason);
       });
      };
     }
     if (typeof globalScope.Promise.prototype.catch !== 'function') {
      globalScope.Promise.prototype.catch = function (onReject) {
       return globalScope.Promise.prototype.then(undefined, onReject);
      };
     }
     return;
    }
    var STATUS_PENDING = 0;
    var STATUS_RESOLVED = 1;
    var STATUS_REJECTED = 2;
    var REJECTION_TIMEOUT = 500;
    var HandlerManager = {
     handlers: [],
     running: false,
     unhandledRejections: [],
     pendingRejectionCheck: false,
     scheduleHandlers: function scheduleHandlers(promise) {
      if (promise._status === STATUS_PENDING) {
       return;
      }
      this.handlers = this.handlers.concat(promise._handlers);
      promise._handlers = [];
      if (this.running) {
       return;
      }
      this.running = true;
      setTimeout(this.runHandlers.bind(this), 0);
     },
     runHandlers: function runHandlers() {
      var RUN_TIMEOUT = 1;
      var timeoutAt = Date.now() + RUN_TIMEOUT;
      while (this.handlers.length > 0) {
       var handler = this.handlers.shift();
       var nextStatus = handler.thisPromise._status;
       var nextValue = handler.thisPromise._value;
       try {
        if (nextStatus === STATUS_RESOLVED) {
         if (typeof handler.onResolve === 'function') {
          nextValue = handler.onResolve(nextValue);
         }
        } else if (typeof handler.onReject === 'function') {
         nextValue = handler.onReject(nextValue);
         nextStatus = STATUS_RESOLVED;
         if (handler.thisPromise._unhandledRejection) {
          this.removeUnhandeledRejection(handler.thisPromise);
         }
        }
       } catch (ex) {
        nextStatus = STATUS_REJECTED;
        nextValue = ex;
       }
       handler.nextPromise._updateStatus(nextStatus, nextValue);
       if (Date.now() >= timeoutAt) {
        break;
       }
      }
      if (this.handlers.length > 0) {
       setTimeout(this.runHandlers.bind(this), 0);
       return;
      }
      this.running = false;
     },
     addUnhandledRejection: function addUnhandledRejection(promise) {
      this.unhandledRejections.push({
       promise: promise,
       time: Date.now()
      });
      this.scheduleRejectionCheck();
     },
     removeUnhandeledRejection: function removeUnhandeledRejection(promise) {
      promise._unhandledRejection = false;
      for (var i = 0; i < this.unhandledRejections.length; i++) {
       if (this.unhandledRejections[i].promise === promise) {
        this.unhandledRejections.splice(i);
        i--;
       }
      }
     },
     scheduleRejectionCheck: function scheduleRejectionCheck() {
      if (this.pendingRejectionCheck) {
       return;
      }
      this.pendingRejectionCheck = true;
      setTimeout(function rejectionCheck() {
       this.pendingRejectionCheck = false;
       var now = Date.now();
       for (var i = 0; i < this.unhandledRejections.length; i++) {
        if (now - this.unhandledRejections[i].time > REJECTION_TIMEOUT) {
         var unhandled = this.unhandledRejections[i].promise._value;
         var msg = 'Unhandled rejection: ' + unhandled;
         if (unhandled.stack) {
          msg += '\n' + unhandled.stack;
         }
         warn(msg);
         this.unhandledRejections.splice(i);
         i--;
        }
       }
       if (this.unhandledRejections.length) {
        this.scheduleRejectionCheck();
       }
      }.bind(this), REJECTION_TIMEOUT);
     }
    };
    var Promise = function Promise(resolver) {
     this._status = STATUS_PENDING;
     this._handlers = [];
     try {
      resolver.call(this, this._resolve.bind(this), this._reject.bind(this));
     } catch (e) {
      this._reject(e);
     }
    };
    Promise.all = function Promise_all(promises) {
     var resolveAll, rejectAll;
     var deferred = new Promise(function (resolve, reject) {
      resolveAll = resolve;
      rejectAll = reject;
     });
     var unresolved = promises.length;
     var results = [];
     if (unresolved === 0) {
      resolveAll(results);
      return deferred;
     }
     function reject(reason) {
      if (deferred._status === STATUS_REJECTED) {
       return;
      }
      results = [];
      rejectAll(reason);
     }
     for (var i = 0, ii = promises.length; i < ii; ++i) {
      var promise = promises[i];
      var resolve = function (i) {
       return function (value) {
        if (deferred._status === STATUS_REJECTED) {
         return;
        }
        results[i] = value;
        unresolved--;
        if (unresolved === 0) {
         resolveAll(results);
        }
       };
      }(i);
      if (Promise.isPromise(promise)) {
       promise.then(resolve, reject);
      } else {
       resolve(promise);
      }
     }
     return deferred;
    };
    Promise.isPromise = function Promise_isPromise(value) {
     return value && typeof value.then === 'function';
    };
    Promise.resolve = function Promise_resolve(value) {
     return new Promise(function (resolve) {
      resolve(value);
     });
    };
    Promise.reject = function Promise_reject(reason) {
     return new Promise(function (resolve, reject) {
      reject(reason);
     });
    };
    Promise.prototype = {
     _status: null,
     _value: null,
     _handlers: null,
     _unhandledRejection: null,
     _updateStatus: function Promise__updateStatus(status, value) {
      if (this._status === STATUS_RESOLVED || this._status === STATUS_REJECTED) {
       return;
      }
      if (status === STATUS_RESOLVED && Promise.isPromise(value)) {
       value.then(this._updateStatus.bind(this, STATUS_RESOLVED), this._updateStatus.bind(this, STATUS_REJECTED));
       return;
      }
      this._status = status;
      this._value = value;
      if (status === STATUS_REJECTED && this._handlers.length === 0) {
       this._unhandledRejection = true;
       HandlerManager.addUnhandledRejection(this);
      }
      HandlerManager.scheduleHandlers(this);
     },
     _resolve: function Promise_resolve(value) {
      this._updateStatus(STATUS_RESOLVED, value);
     },
     _reject: function Promise_reject(reason) {
      this._updateStatus(STATUS_REJECTED, reason);
     },
     then: function Promise_then(onResolve, onReject) {
      var nextPromise = new Promise(function (resolve, reject) {
       this.resolve = resolve;
       this.reject = reject;
      });
      this._handlers.push({
       thisPromise: this,
       onResolve: onResolve,
       onReject: onReject,
       nextPromise: nextPromise
      });
      HandlerManager.scheduleHandlers(this);
      return nextPromise;
     },
     catch: function Promise_catch(onReject) {
      return this.then(undefined, onReject);
     }
    };
    globalScope.Promise = Promise;
   }());
   (function WeakMapClosure() {
    if (globalScope.WeakMap) {
     return;
    }
    var id = 0;
    function WeakMap() {
     this.id = '$weakmap' + id++;
    }
    WeakMap.prototype = {
     has: function (obj) {
      return !!Object.getOwnPropertyDescriptor(obj, this.id);
     },
     get: function (obj, defaultValue) {
      return this.has(obj) ? obj[this.id] : defaultValue;
     },
     set: function (obj, value) {
      Object.defineProperty(obj, this.id, {
       value: value,
       enumerable: false,
       configurable: true
      });
     },
     delete: function (obj) {
      delete obj[this.id];
     }
    };
    globalScope.WeakMap = WeakMap;
   }());
   var StatTimer = function StatTimerClosure() {
    function rpad(str, pad, length) {
     while (str.length < length) {
      str += pad;
     }
     return str;
    }
    function StatTimer() {
     this.started = Object.create(null);
     this.times = [];
     this.enabled = true;
    }
    StatTimer.prototype = {
     time: function StatTimer_time(name) {
      if (!this.enabled) {
       return;
      }
      if (name in this.started) {
       warn('Timer is already running for ' + name);
      }
      this.started[name] = Date.now();
     },
     timeEnd: function StatTimer_timeEnd(name) {
      if (!this.enabled) {
       return;
      }
      if (!(name in this.started)) {
       warn('Timer has not been started for ' + name);
      }
      this.times.push({
       'name': name,
       'start': this.started[name],
       'end': Date.now()
      });
      delete this.started[name];
     },
     toString: function StatTimer_toString() {
      var i, ii;
      var times = this.times;
      var out = '';
      var longest = 0;
      for (i = 0, ii = times.length; i < ii; ++i) {
       var name = times[i]['name'];
       if (name.length > longest) {
        longest = name.length;
       }
      }
      for (i = 0, ii = times.length; i < ii; ++i) {
       var span = times[i];
       var duration = span.end - span.start;
       out += rpad(span['name'], ' ', longest) + ' ' + duration + 'ms\n';
      }
      return out;
     }
    };
    return StatTimer;
   }();
   var createBlob = function createBlob(data, contentType) {
    if (typeof Blob !== 'undefined') {
     return new Blob([data], { type: contentType });
    }
    warn('The "Blob" constructor is not supported.');
   };
   var createObjectURL = function createObjectURLClosure() {
    var digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    return function createObjectURL(data, contentType, forceDataSchema) {
     if (!forceDataSchema && typeof URL !== 'undefined' && URL.createObjectURL) {
      var blob = createBlob(data, contentType);
      return URL.createObjectURL(blob);
     }
     var buffer = 'data:' + contentType + ';base64,';
     for (var i = 0, ii = data.length; i < ii; i += 3) {
      var b1 = data[i] & 0xFF;
      var b2 = data[i + 1] & 0xFF;
      var b3 = data[i + 2] & 0xFF;
      var d1 = b1 >> 2, d2 = (b1 & 3) << 4 | b2 >> 4;
      var d3 = i + 1 < ii ? (b2 & 0xF) << 2 | b3 >> 6 : 64;
      var d4 = i + 2 < ii ? b3 & 0x3F : 64;
      buffer += digits[d1] + digits[d2] + digits[d3] + digits[d4];
     }
     return buffer;
    };
   }();
   function MessageHandler(sourceName, targetName, comObj) {
    this.sourceName = sourceName;
    this.targetName = targetName;
    this.comObj = comObj;
    this.callbackIndex = 1;
    this.postMessageTransfers = true;
    var callbacksCapabilities = this.callbacksCapabilities = Object.create(null);
    var ah = this.actionHandler = Object.create(null);
    this._onComObjOnMessage = function messageHandlerComObjOnMessage(event) {
     var data = event.data;
     if (data.targetName !== this.sourceName) {
      return;
     }
     if (data.isReply) {
      var callbackId = data.callbackId;
      if (data.callbackId in callbacksCapabilities) {
       var callback = callbacksCapabilities[callbackId];
       delete callbacksCapabilities[callbackId];
       if ('error' in data) {
        callback.reject(data.error);
       } else {
        callback.resolve(data.data);
       }
      } else {
       error('Cannot resolve callback ' + callbackId);
      }
     } else if (data.action in ah) {
      var action = ah[data.action];
      if (data.callbackId) {
       var sourceName = this.sourceName;
       var targetName = data.sourceName;
       Promise.resolve().then(function () {
        return action[0].call(action[1], data.data);
       }).then(function (result) {
        comObj.postMessage({
         sourceName: sourceName,
         targetName: targetName,
         isReply: true,
         callbackId: data.callbackId,
         data: result
        });
       }, function (reason) {
        if (reason instanceof Error) {
         reason = reason + '';
        }
        comObj.postMessage({
         sourceName: sourceName,
         targetName: targetName,
         isReply: true,
         callbackId: data.callbackId,
         error: reason
        });
       });
      } else {
       action[0].call(action[1], data.data);
      }
     } else {
      error('Unknown action from worker: ' + data.action);
     }
    }.bind(this);
    comObj.addEventListener('message', this._onComObjOnMessage);
   }
   MessageHandler.prototype = {
    on: function messageHandlerOn(actionName, handler, scope) {
     var ah = this.actionHandler;
     if (ah[actionName]) {
      error('There is already an actionName called "' + actionName + '"');
     }
     ah[actionName] = [
      handler,
      scope
     ];
    },
    send: function messageHandlerSend(actionName, data, transfers) {
     var message = {
      sourceName: this.sourceName,
      targetName: this.targetName,
      action: actionName,
      data: data
     };
     this.postMessage(message, transfers);
    },
    sendWithPromise: function messageHandlerSendWithPromise(actionName, data, transfers) {
     var callbackId = this.callbackIndex++;
     var message = {
      sourceName: this.sourceName,
      targetName: this.targetName,
      action: actionName,
      data: data,
      callbackId: callbackId
     };
     var capability = createPromiseCapability();
     this.callbacksCapabilities[callbackId] = capability;
     try {
      this.postMessage(message, transfers);
     } catch (e) {
      capability.reject(e);
     }
     return capability.promise;
    },
    postMessage: function (message, transfers) {
     if (transfers && this.postMessageTransfers) {
      this.comObj.postMessage(message, transfers);
     } else {
      this.comObj.postMessage(message);
     }
    },
    destroy: function () {
     this.comObj.removeEventListener('message', this._onComObjOnMessage);
    }
   };
   function loadJpegStream(id, imageUrl, objs) {
    var img = new Image();
    img.onload = function loadJpegStream_onloadClosure() {
     objs.resolve(id, img);
    };
    img.onerror = function loadJpegStream_onerrorClosure() {
     objs.resolve(id, null);
     warn('Error during JPEG image loading');
    };
    img.src = imageUrl;
   }
   /* Any copyright is dedicated to the Public Domain.
    * http://creativecommons.org/publicdomain/zero/1.0/ */
   (function checkURLConstructor(scope) {
    var hasWorkingUrl = false;
    try {
     if (typeof URL === 'function' && typeof URL.prototype === 'object' && 'origin' in URL.prototype) {
      var u = new URL('b', 'http://a');
      u.pathname = 'c%20d';
      hasWorkingUrl = u.href === 'http://a/c%20d';
     }
    } catch (e) {
    }
    if (hasWorkingUrl) {
     return;
    }
    var relative = Object.create(null);
    relative['ftp'] = 21;
    relative['file'] = 0;
    relative['gopher'] = 70;
    relative['http'] = 80;
    relative['https'] = 443;
    relative['ws'] = 80;
    relative['wss'] = 443;
    var relativePathDotMapping = Object.create(null);
    relativePathDotMapping['%2e'] = '.';
    relativePathDotMapping['.%2e'] = '..';
    relativePathDotMapping['%2e.'] = '..';
    relativePathDotMapping['%2e%2e'] = '..';
    function isRelativeScheme(scheme) {
     return relative[scheme] !== undefined;
    }
    function invalid() {
     clear.call(this);
     this._isInvalid = true;
    }
    function IDNAToASCII(h) {
     if ('' === h) {
      invalid.call(this);
     }
     return h.toLowerCase();
    }
    function percentEscape(c) {
     var unicode = c.charCodeAt(0);
     if (unicode > 0x20 && unicode < 0x7F && [
       0x22,
       0x23,
       0x3C,
       0x3E,
       0x3F,
       0x60
      ].indexOf(unicode) === -1) {
      return c;
     }
     return encodeURIComponent(c);
    }
    function percentEscapeQuery(c) {
     var unicode = c.charCodeAt(0);
     if (unicode > 0x20 && unicode < 0x7F && [
       0x22,
       0x23,
       0x3C,
       0x3E,
       0x60
      ].indexOf(unicode) === -1) {
      return c;
     }
     return encodeURIComponent(c);
    }
    var EOF, ALPHA = /[a-zA-Z]/, ALPHANUMERIC = /[a-zA-Z0-9\+\-\.]/;
    function parse(input, stateOverride, base) {
     function err(message) {
      errors.push(message);
     }
     var state = stateOverride || 'scheme start', cursor = 0, buffer = '', seenAt = false, seenBracket = false, errors = [];
     loop:
      while ((input[cursor - 1] !== EOF || cursor === 0) && !this._isInvalid) {
       var c = input[cursor];
       switch (state) {
       case 'scheme start':
        if (c && ALPHA.test(c)) {
         buffer += c.toLowerCase();
         state = 'scheme';
        } else if (!stateOverride) {
         buffer = '';
         state = 'no scheme';
         continue;
        } else {
         err('Invalid scheme.');
         break loop;
        }
        break;
       case 'scheme':
        if (c && ALPHANUMERIC.test(c)) {
         buffer += c.toLowerCase();
        } else if (':' === c) {
         this._scheme = buffer;
         buffer = '';
         if (stateOverride) {
          break loop;
         }
         if (isRelativeScheme(this._scheme)) {
          this._isRelative = true;
         }
         if ('file' === this._scheme) {
          state = 'relative';
         } else if (this._isRelative && base && base._scheme === this._scheme) {
          state = 'relative or authority';
         } else if (this._isRelative) {
          state = 'authority first slash';
         } else {
          state = 'scheme data';
         }
        } else if (!stateOverride) {
         buffer = '';
         cursor = 0;
         state = 'no scheme';
         continue;
        } else if (EOF === c) {
         break loop;
        } else {
         err('Code point not allowed in scheme: ' + c);
         break loop;
        }
        break;
       case 'scheme data':
        if ('?' === c) {
         this._query = '?';
         state = 'query';
        } else if ('#' === c) {
         this._fragment = '#';
         state = 'fragment';
        } else {
         if (EOF !== c && '\t' !== c && '\n' !== c && '\r' !== c) {
          this._schemeData += percentEscape(c);
         }
        }
        break;
       case 'no scheme':
        if (!base || !isRelativeScheme(base._scheme)) {
         err('Missing scheme.');
         invalid.call(this);
        } else {
         state = 'relative';
         continue;
        }
        break;
       case 'relative or authority':
        if ('/' === c && '/' === input[cursor + 1]) {
         state = 'authority ignore slashes';
        } else {
         err('Expected /, got: ' + c);
         state = 'relative';
         continue;
        }
        break;
       case 'relative':
        this._isRelative = true;
        if ('file' !== this._scheme) {
         this._scheme = base._scheme;
        }
        if (EOF === c) {
         this._host = base._host;
         this._port = base._port;
         this._path = base._path.slice();
         this._query = base._query;
         this._username = base._username;
         this._password = base._password;
         break loop;
        } else if ('/' === c || '\\' === c) {
         if ('\\' === c) {
          err('\\ is an invalid code point.');
         }
         state = 'relative slash';
        } else if ('?' === c) {
         this._host = base._host;
         this._port = base._port;
         this._path = base._path.slice();
         this._query = '?';
         this._username = base._username;
         this._password = base._password;
         state = 'query';
        } else if ('#' === c) {
         this._host = base._host;
         this._port = base._port;
         this._path = base._path.slice();
         this._query = base._query;
         this._fragment = '#';
         this._username = base._username;
         this._password = base._password;
         state = 'fragment';
        } else {
         var nextC = input[cursor + 1];
         var nextNextC = input[cursor + 2];
         if ('file' !== this._scheme || !ALPHA.test(c) || nextC !== ':' && nextC !== '|' || EOF !== nextNextC && '/' !== nextNextC && '\\' !== nextNextC && '?' !== nextNextC && '#' !== nextNextC) {
          this._host = base._host;
          this._port = base._port;
          this._username = base._username;
          this._password = base._password;
          this._path = base._path.slice();
          this._path.pop();
         }
         state = 'relative path';
         continue;
        }
        break;
       case 'relative slash':
        if ('/' === c || '\\' === c) {
         if ('\\' === c) {
          err('\\ is an invalid code point.');
         }
         if ('file' === this._scheme) {
          state = 'file host';
         } else {
          state = 'authority ignore slashes';
         }
        } else {
         if ('file' !== this._scheme) {
          this._host = base._host;
          this._port = base._port;
          this._username = base._username;
          this._password = base._password;
         }
         state = 'relative path';
         continue;
        }
        break;
       case 'authority first slash':
        if ('/' === c) {
         state = 'authority second slash';
        } else {
         err('Expected \'/\', got: ' + c);
         state = 'authority ignore slashes';
         continue;
        }
        break;
       case 'authority second slash':
        state = 'authority ignore slashes';
        if ('/' !== c) {
         err('Expected \'/\', got: ' + c);
         continue;
        }
        break;
       case 'authority ignore slashes':
        if ('/' !== c && '\\' !== c) {
         state = 'authority';
         continue;
        } else {
         err('Expected authority, got: ' + c);
        }
        break;
       case 'authority':
        if ('@' === c) {
         if (seenAt) {
          err('@ already seen.');
          buffer += '%40';
         }
         seenAt = true;
         for (var i = 0; i < buffer.length; i++) {
          var cp = buffer[i];
          if ('\t' === cp || '\n' === cp || '\r' === cp) {
           err('Invalid whitespace in authority.');
           continue;
          }
          if (':' === cp && null === this._password) {
           this._password = '';
           continue;
          }
          var tempC = percentEscape(cp);
          if (null !== this._password) {
           this._password += tempC;
          } else {
           this._username += tempC;
          }
         }
         buffer = '';
        } else if (EOF === c || '/' === c || '\\' === c || '?' === c || '#' === c) {
         cursor -= buffer.length;
         buffer = '';
         state = 'host';
         continue;
        } else {
         buffer += c;
        }
        break;
       case 'file host':
        if (EOF === c || '/' === c || '\\' === c || '?' === c || '#' === c) {
         if (buffer.length === 2 && ALPHA.test(buffer[0]) && (buffer[1] === ':' || buffer[1] === '|')) {
          state = 'relative path';
         } else if (buffer.length === 0) {
          state = 'relative path start';
         } else {
          this._host = IDNAToASCII.call(this, buffer);
          buffer = '';
          state = 'relative path start';
         }
         continue;
        } else if ('\t' === c || '\n' === c || '\r' === c) {
         err('Invalid whitespace in file host.');
        } else {
         buffer += c;
        }
        break;
       case 'host':
       case 'hostname':
        if (':' === c && !seenBracket) {
         this._host = IDNAToASCII.call(this, buffer);
         buffer = '';
         state = 'port';
         if ('hostname' === stateOverride) {
          break loop;
         }
        } else if (EOF === c || '/' === c || '\\' === c || '?' === c || '#' === c) {
         this._host = IDNAToASCII.call(this, buffer);
         buffer = '';
         state = 'relative path start';
         if (stateOverride) {
          break loop;
         }
         continue;
        } else if ('\t' !== c && '\n' !== c && '\r' !== c) {
         if ('[' === c) {
          seenBracket = true;
         } else if (']' === c) {
          seenBracket = false;
         }
         buffer += c;
        } else {
         err('Invalid code point in host/hostname: ' + c);
        }
        break;
       case 'port':
        if (/[0-9]/.test(c)) {
         buffer += c;
        } else if (EOF === c || '/' === c || '\\' === c || '?' === c || '#' === c || stateOverride) {
         if ('' !== buffer) {
          var temp = parseInt(buffer, 10);
          if (temp !== relative[this._scheme]) {
           this._port = temp + '';
          }
          buffer = '';
         }
         if (stateOverride) {
          break loop;
         }
         state = 'relative path start';
         continue;
        } else if ('\t' === c || '\n' === c || '\r' === c) {
         err('Invalid code point in port: ' + c);
        } else {
         invalid.call(this);
        }
        break;
       case 'relative path start':
        if ('\\' === c) {
         err('\'\\\' not allowed in path.');
        }
        state = 'relative path';
        if ('/' !== c && '\\' !== c) {
         continue;
        }
        break;
       case 'relative path':
        if (EOF === c || '/' === c || '\\' === c || !stateOverride && ('?' === c || '#' === c)) {
         if ('\\' === c) {
          err('\\ not allowed in relative path.');
         }
         var tmp;
         if (tmp = relativePathDotMapping[buffer.toLowerCase()]) {
          buffer = tmp;
         }
         if ('..' === buffer) {
          this._path.pop();
          if ('/' !== c && '\\' !== c) {
           this._path.push('');
          }
         } else if ('.' === buffer && '/' !== c && '\\' !== c) {
          this._path.push('');
         } else if ('.' !== buffer) {
          if ('file' === this._scheme && this._path.length === 0 && buffer.length === 2 && ALPHA.test(buffer[0]) && buffer[1] === '|') {
           buffer = buffer[0] + ':';
          }
          this._path.push(buffer);
         }
         buffer = '';
         if ('?' === c) {
          this._query = '?';
          state = 'query';
         } else if ('#' === c) {
          this._fragment = '#';
          state = 'fragment';
         }
        } else if ('\t' !== c && '\n' !== c && '\r' !== c) {
         buffer += percentEscape(c);
        }
        break;
       case 'query':
        if (!stateOverride && '#' === c) {
         this._fragment = '#';
         state = 'fragment';
        } else if (EOF !== c && '\t' !== c && '\n' !== c && '\r' !== c) {
         this._query += percentEscapeQuery(c);
        }
        break;
       case 'fragment':
        if (EOF !== c && '\t' !== c && '\n' !== c && '\r' !== c) {
         this._fragment += c;
        }
        break;
       }
       cursor++;
      }
    }
    function clear() {
     this._scheme = '';
     this._schemeData = '';
     this._username = '';
     this._password = null;
     this._host = '';
     this._port = '';
     this._path = [];
     this._query = '';
     this._fragment = '';
     this._isInvalid = false;
     this._isRelative = false;
    }
    function JURL(url, base)
     {
      if (base !== undefined && !(base instanceof JURL)) {
       base = new JURL(String(base));
      }
      this._url = url;
      clear.call(this);
      var input = url.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, '');
      parse.call(this, input, null, base);
     }
    JURL.prototype = {
     toString: function () {
      return this.href;
     },
     get href() {
      if (this._isInvalid) {
       return this._url;
      }
      var authority = '';
      if ('' !== this._username || null !== this._password) {
       authority = this._username + (null !== this._password ? ':' + this._password : '') + '@';
      }
      return this.protocol + (this._isRelative ? '//' + authority + this.host : '') + this.pathname + this._query + this._fragment;
     },
     set href(href) {
      clear.call(this);
      parse.call(this, href);
     },
     get protocol() {
      return this._scheme + ':';
     },
     set protocol(protocol) {
      if (this._isInvalid) {
       return;
      }
      parse.call(this, protocol + ':', 'scheme start');
     },
     get host() {
      return this._isInvalid ? '' : this._port ? this._host + ':' + this._port : this._host;
     },
     set host(host) {
      if (this._isInvalid || !this._isRelative) {
       return;
      }
      parse.call(this, host, 'host');
     },
     get hostname() {
      return this._host;
     },
     set hostname(hostname) {
      if (this._isInvalid || !this._isRelative) {
       return;
      }
      parse.call(this, hostname, 'hostname');
     },
     get port() {
      return this._port;
     },
     set port(port) {
      if (this._isInvalid || !this._isRelative) {
       return;
      }
      parse.call(this, port, 'port');
     },
     get pathname() {
      return this._isInvalid ? '' : this._isRelative ? '/' + this._path.join('/') : this._schemeData;
     },
     set pathname(pathname) {
      if (this._isInvalid || !this._isRelative) {
       return;
      }
      this._path = [];
      parse.call(this, pathname, 'relative path start');
     },
     get search() {
      return this._isInvalid || !this._query || '?' === this._query ? '' : this._query;
     },
     set search(search) {
      if (this._isInvalid || !this._isRelative) {
       return;
      }
      this._query = '?';
      if ('?' === search[0]) {
       search = search.slice(1);
      }
      parse.call(this, search, 'query');
     },
     get hash() {
      return this._isInvalid || !this._fragment || '#' === this._fragment ? '' : this._fragment;
     },
     set hash(hash) {
      if (this._isInvalid) {
       return;
      }
      this._fragment = '#';
      if ('#' === hash[0]) {
       hash = hash.slice(1);
      }
      parse.call(this, hash, 'fragment');
     },
     get origin() {
      var host;
      if (this._isInvalid || !this._scheme) {
       return '';
      }
      switch (this._scheme) {
      case 'data':
      case 'file':
      case 'javascript':
      case 'mailto':
       return 'null';
      }
      host = this.host;
      if (!host) {
       return '';
      }
      return this._scheme + '://' + host;
     }
    };
    var OriginalURL = scope.URL;
    if (OriginalURL) {
     JURL.createObjectURL = function (blob) {
      return OriginalURL.createObjectURL.apply(OriginalURL, arguments);
     };
     JURL.revokeObjectURL = function (url) {
      OriginalURL.revokeObjectURL(url);
     };
    }
    scope.URL = JURL;
   }(globalScope));
   exports.FONT_IDENTITY_MATRIX = FONT_IDENTITY_MATRIX;
   exports.IDENTITY_MATRIX = IDENTITY_MATRIX;
   exports.OPS = OPS;
   exports.VERBOSITY_LEVELS = VERBOSITY_LEVELS;
   exports.UNSUPPORTED_FEATURES = UNSUPPORTED_FEATURES;
   exports.AnnotationBorderStyleType = AnnotationBorderStyleType;
   exports.AnnotationFieldFlag = AnnotationFieldFlag;
   exports.AnnotationFlag = AnnotationFlag;
   exports.AnnotationType = AnnotationType;
   exports.FontType = FontType;
   exports.ImageKind = ImageKind;
   exports.InvalidPDFException = InvalidPDFException;
   exports.MessageHandler = MessageHandler;
   exports.MissingDataException = MissingDataException;
   exports.MissingPDFException = MissingPDFException;
   exports.NotImplementedException = NotImplementedException;
   exports.PageViewport = PageViewport;
   exports.PasswordException = PasswordException;
   exports.PasswordResponses = PasswordResponses;
   exports.StatTimer = StatTimer;
   exports.StreamType = StreamType;
   exports.TextRenderingMode = TextRenderingMode;
   exports.UnexpectedResponseException = UnexpectedResponseException;
   exports.UnknownErrorException = UnknownErrorException;
   exports.Util = Util;
   exports.XRefParseException = XRefParseException;
   exports.arrayByteLength = arrayByteLength;
   exports.arraysToBytes = arraysToBytes;
   exports.assert = assert;
   exports.bytesToString = bytesToString;
   exports.createBlob = createBlob;
   exports.createPromiseCapability = createPromiseCapability;
   exports.createObjectURL = createObjectURL;
   exports.deprecated = deprecated;
   exports.error = error;
   exports.getLookupTableFactory = getLookupTableFactory;
   exports.getVerbosityLevel = getVerbosityLevel;
   exports.globalScope = globalScope;
   exports.info = info;
   exports.isArray = isArray;
   exports.isArrayBuffer = isArrayBuffer;
   exports.isBool = isBool;
   exports.isEmptyObj = isEmptyObj;
   exports.isInt = isInt;
   exports.isNum = isNum;
   exports.isString = isString;
   exports.isSpace = isSpace;
   exports.isSameOrigin = isSameOrigin;
   exports.createValidAbsoluteUrl = createValidAbsoluteUrl;
   exports.isLittleEndian = isLittleEndian;
   exports.isEvalSupported = isEvalSupported;
   exports.loadJpegStream = loadJpegStream;
   exports.log2 = log2;
   exports.readInt8 = readInt8;
   exports.readUint16 = readUint16;
   exports.readUint32 = readUint32;
   exports.removeNullCharacters = removeNullCharacters;
   exports.setVerbosityLevel = setVerbosityLevel;
   exports.shadow = shadow;
   exports.string32 = string32;
   exports.stringToBytes = stringToBytes;
   exports.stringToPDFString = stringToPDFString;
   exports.stringToUTF8String = stringToUTF8String;
   exports.utf8StringToString = utf8StringToString;
   exports.warn = warn;
  }));
  (function (root, factory) {
   factory(root.pdfjsDisplayDOMUtils = {}, root.pdfjsSharedUtil);
  }(this, function (exports, sharedUtil) {
   var removeNullCharacters = sharedUtil.removeNullCharacters;
   var warn = sharedUtil.warn;
   var deprecated = sharedUtil.deprecated;
   var createValidAbsoluteUrl = sharedUtil.createValidAbsoluteUrl;
   var CustomStyle = function CustomStyleClosure() {
    var prefixes = [
     'ms',
     'Moz',
     'Webkit',
     'O'
    ];
    var _cache = Object.create(null);
    function CustomStyle() {
    }
    CustomStyle.getProp = function get(propName, element) {
     if (arguments.length === 1 && typeof _cache[propName] === 'string') {
      return _cache[propName];
     }
     element = element || document.documentElement;
     var style = element.style, prefixed, uPropName;
     if (typeof style[propName] === 'string') {
      return _cache[propName] = propName;
     }
     uPropName = propName.charAt(0).toUpperCase() + propName.slice(1);
     for (var i = 0, l = prefixes.length; i < l; i++) {
      prefixed = prefixes[i] + uPropName;
      if (typeof style[prefixed] === 'string') {
       return _cache[propName] = prefixed;
      }
     }
     return _cache[propName] = 'undefined';
    };
    CustomStyle.setProp = function set(propName, element, str) {
     var prop = this.getProp(propName);
     if (prop !== 'undefined') {
      element.style[prop] = str;
     }
    };
    return CustomStyle;
   }();
   var hasCanvasTypedArrays;
   hasCanvasTypedArrays = function hasCanvasTypedArrays() {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    var ctx = canvas.getContext('2d');
    var imageData = ctx.createImageData(1, 1);
    return typeof imageData.data.buffer !== 'undefined';
   };
   var LinkTarget = {
    NONE: 0,
    SELF: 1,
    BLANK: 2,
    PARENT: 3,
    TOP: 4
   };
   var LinkTargetStringMap = [
    '',
    '_self',
    '_blank',
    '_parent',
    '_top'
   ];
   function addLinkAttributes(link, params) {
    var url = params && params.url;
    link.href = link.title = url ? removeNullCharacters(url) : '';
    if (url) {
     var target = params.target;
     if (typeof target === 'undefined') {
      target = getDefaultSetting('externalLinkTarget');
     }
     link.target = LinkTargetStringMap[target];
     var rel = params.rel;
     if (typeof rel === 'undefined') {
      rel = getDefaultSetting('externalLinkRel');
     }
     link.rel = rel;
    }
   }
   function getFilenameFromUrl(url) {
    var anchor = url.indexOf('#');
    var query = url.indexOf('?');
    var end = Math.min(anchor > 0 ? anchor : url.length, query > 0 ? query : url.length);
    return url.substring(url.lastIndexOf('/', end) + 1, end);
   }
   function getDefaultSetting(id) {
    var globalSettings = sharedUtil.globalScope.PDFJS;
    switch (id) {
    case 'pdfBug':
     return globalSettings ? globalSettings.pdfBug : false;
    case 'disableAutoFetch':
     return globalSettings ? globalSettings.disableAutoFetch : false;
    case 'disableStream':
     return globalSettings ? globalSettings.disableStream : false;
    case 'disableRange':
     return globalSettings ? globalSettings.disableRange : false;
    case 'disableFontFace':
     return globalSettings ? globalSettings.disableFontFace : false;
    case 'disableCreateObjectURL':
     return globalSettings ? globalSettings.disableCreateObjectURL : false;
    case 'disableWebGL':
     return globalSettings ? globalSettings.disableWebGL : true;
    case 'cMapUrl':
     return globalSettings ? globalSettings.cMapUrl : null;
    case 'cMapPacked':
     return globalSettings ? globalSettings.cMapPacked : false;
    case 'postMessageTransfers':
     return globalSettings ? globalSettings.postMessageTransfers : true;
    case 'workerSrc':
     return globalSettings ? globalSettings.workerSrc : null;
    case 'disableWorker':
     return globalSettings ? globalSettings.disableWorker : false;
    case 'maxImageSize':
     return globalSettings ? globalSettings.maxImageSize : -1;
    case 'imageResourcesPath':
     return globalSettings ? globalSettings.imageResourcesPath : '';
    case 'isEvalSupported':
     return globalSettings ? globalSettings.isEvalSupported : true;
    case 'externalLinkTarget':
     if (!globalSettings) {
      return LinkTarget.NONE;
     }
     switch (globalSettings.externalLinkTarget) {
     case LinkTarget.NONE:
     case LinkTarget.SELF:
     case LinkTarget.BLANK:
     case LinkTarget.PARENT:
     case LinkTarget.TOP:
      return globalSettings.externalLinkTarget;
     }
     warn('PDFJS.externalLinkTarget is invalid: ' + globalSettings.externalLinkTarget);
     globalSettings.externalLinkTarget = LinkTarget.NONE;
     return LinkTarget.NONE;
    case 'externalLinkRel':
     return globalSettings ? globalSettings.externalLinkRel : 'noreferrer';
    case 'enableStats':
     return !!(globalSettings && globalSettings.enableStats);
    default:
     throw new Error('Unknown default setting: ' + id);
    }
   }
   function isExternalLinkTargetSet() {
    var externalLinkTarget = getDefaultSetting('externalLinkTarget');
    switch (externalLinkTarget) {
    case LinkTarget.NONE:
     return false;
    case LinkTarget.SELF:
    case LinkTarget.BLANK:
    case LinkTarget.PARENT:
    case LinkTarget.TOP:
     return true;
    }
   }
   function isValidUrl(url, allowRelative) {
    deprecated('isValidUrl(), please use createValidAbsoluteUrl() instead.');
    var baseUrl = allowRelative ? 'http://example.com' : null;
    return createValidAbsoluteUrl(url, baseUrl) !== null;
   }
   exports.CustomStyle = CustomStyle;
   exports.addLinkAttributes = addLinkAttributes;
   exports.isExternalLinkTargetSet = isExternalLinkTargetSet;
   exports.isValidUrl = isValidUrl;
   exports.getFilenameFromUrl = getFilenameFromUrl;
   exports.LinkTarget = LinkTarget;
   exports.hasCanvasTypedArrays = hasCanvasTypedArrays;
   exports.getDefaultSetting = getDefaultSetting;
  }));
  (function (root, factory) {
   factory(root.pdfjsDisplayFontLoader = {}, root.pdfjsSharedUtil);
  }(this, function (exports, sharedUtil) {
   var assert = sharedUtil.assert;
   var bytesToString = sharedUtil.bytesToString;
   var string32 = sharedUtil.string32;
   var shadow = sharedUtil.shadow;
   var warn = sharedUtil.warn;
   function FontLoader(docId) {
    this.docId = docId;
    this.styleElement = null;
    this.nativeFontFaces = [];
    this.loadTestFontId = 0;
    this.loadingContext = {
     requests: [],
     nextRequestId: 0
    };
   }
   FontLoader.prototype = {
    insertRule: function fontLoaderInsertRule(rule) {
     var styleElement = this.styleElement;
     if (!styleElement) {
      styleElement = this.styleElement = document.createElement('style');
      styleElement.id = 'PDFJS_FONT_STYLE_TAG_' + this.docId;
      document.documentElement.getElementsByTagName('head')[0].appendChild(styleElement);
     }
     var styleSheet = styleElement.sheet;
     styleSheet.insertRule(rule, styleSheet.cssRules.length);
    },
    clear: function fontLoaderClear() {
     var styleElement = this.styleElement;
     if (styleElement) {
      styleElement.parentNode.removeChild(styleElement);
      styleElement = this.styleElement = null;
     }
     this.nativeFontFaces.forEach(function (nativeFontFace) {
      document.fonts.delete(nativeFontFace);
     });
     this.nativeFontFaces.length = 0;
    }
   };
   var getLoadTestFont = function () {
    return atob('T1RUTwALAIAAAwAwQ0ZGIDHtZg4AAAOYAAAAgUZGVE1lkzZwAAAEHAAAABxHREVGABQAFQ' + 'AABDgAAAAeT1MvMlYNYwkAAAEgAAAAYGNtYXABDQLUAAACNAAAAUJoZWFk/xVFDQAAALwA' + 'AAA2aGhlYQdkA+oAAAD0AAAAJGhtdHgD6AAAAAAEWAAAAAZtYXhwAAJQAAAAARgAAAAGbm' + 'FtZVjmdH4AAAGAAAAAsXBvc3T/hgAzAAADeAAAACAAAQAAAAEAALZRFsRfDzz1AAsD6AAA' + 'AADOBOTLAAAAAM4KHDwAAAAAA+gDIQAAAAgAAgAAAAAAAAABAAADIQAAAFoD6AAAAAAD6A' + 'ABAAAAAAAAAAAAAAAAAAAAAQAAUAAAAgAAAAQD6AH0AAUAAAKKArwAAACMAooCvAAAAeAA' + 'MQECAAACAAYJAAAAAAAAAAAAAQAAAAAAAAAAAAAAAFBmRWQAwAAuAC4DIP84AFoDIQAAAA' + 'AAAQAAAAAAAAAAACAAIAABAAAADgCuAAEAAAAAAAAAAQAAAAEAAAAAAAEAAQAAAAEAAAAA' + 'AAIAAQAAAAEAAAAAAAMAAQAAAAEAAAAAAAQAAQAAAAEAAAAAAAUAAQAAAAEAAAAAAAYAAQ' + 'AAAAMAAQQJAAAAAgABAAMAAQQJAAEAAgABAAMAAQQJAAIAAgABAAMAAQQJAAMAAgABAAMA' + 'AQQJAAQAAgABAAMAAQQJAAUAAgABAAMAAQQJAAYAAgABWABYAAAAAAAAAwAAAAMAAAAcAA' + 'EAAAAAADwAAwABAAAAHAAEACAAAAAEAAQAAQAAAC7//wAAAC7////TAAEAAAAAAAABBgAA' + 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAA' + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAA' + 'AAAAD/gwAyAAAAAQAAAAAAAAAAAAAAAAAAAAABAAQEAAEBAQJYAAEBASH4DwD4GwHEAvgc' + 'A/gXBIwMAYuL+nz5tQXkD5j3CBLnEQACAQEBIVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWF' + 'hYWFhYWFhYAAABAQAADwACAQEEE/t3Dov6fAH6fAT+fPp8+nwHDosMCvm1Cvm1DAz6fBQA' + 'AAAAAAABAAAAAMmJbzEAAAAAzgTjFQAAAADOBOQpAAEAAAAAAAAADAAUAAQAAAABAAAAAg' + 'ABAAAAAAAAAAAD6AAAAAAAAA==');
   };
   Object.defineProperty(FontLoader.prototype, 'loadTestFont', {
    get: function () {
     return shadow(this, 'loadTestFont', getLoadTestFont());
    },
    configurable: true
   });
   FontLoader.prototype.addNativeFontFace = function fontLoader_addNativeFontFace(nativeFontFace) {
    this.nativeFontFaces.push(nativeFontFace);
    document.fonts.add(nativeFontFace);
   };
   FontLoader.prototype.bind = function fontLoaderBind(fonts, callback) {
    var rules = [];
    var fontsToLoad = [];
    var fontLoadPromises = [];
    var getNativeFontPromise = function (nativeFontFace) {
     return nativeFontFace.loaded.catch(function (e) {
      warn('Failed to load font "' + nativeFontFace.family + '": ' + e);
     });
    };
    var isFontLoadingAPISupported = FontLoader.isFontLoadingAPISupported && !FontLoader.isSyncFontLoadingSupported;
    for (var i = 0, ii = fonts.length; i < ii; i++) {
     var font = fonts[i];
     if (font.attached || font.loading === false) {
      continue;
     }
     font.attached = true;
     if (isFontLoadingAPISupported) {
      var nativeFontFace = font.createNativeFontFace();
      if (nativeFontFace) {
       this.addNativeFontFace(nativeFontFace);
       fontLoadPromises.push(getNativeFontPromise(nativeFontFace));
      }
     } else {
      var rule = font.createFontFaceRule();
      if (rule) {
       this.insertRule(rule);
       rules.push(rule);
       fontsToLoad.push(font);
      }
     }
    }
    var request = this.queueLoadingCallback(callback);
    if (isFontLoadingAPISupported) {
     Promise.all(fontLoadPromises).then(function () {
      request.complete();
     });
    } else if (rules.length > 0 && !FontLoader.isSyncFontLoadingSupported) {
     this.prepareFontLoadEvent(rules, fontsToLoad, request);
    } else {
     request.complete();
    }
   };
   FontLoader.prototype.queueLoadingCallback = function FontLoader_queueLoadingCallback(callback) {
    function LoadLoader_completeRequest() {
     assert(!request.end, 'completeRequest() cannot be called twice');
     request.end = Date.now();
     while (context.requests.length > 0 && context.requests[0].end) {
      var otherRequest = context.requests.shift();
      setTimeout(otherRequest.callback, 0);
     }
    }
    var context = this.loadingContext;
    var requestId = 'pdfjs-font-loading-' + context.nextRequestId++;
    var request = {
     id: requestId,
     complete: LoadLoader_completeRequest,
     callback: callback,
     started: Date.now()
    };
    context.requests.push(request);
    return request;
   };
   FontLoader.prototype.prepareFontLoadEvent = function fontLoaderPrepareFontLoadEvent(rules, fonts, request) {
    function int32(data, offset) {
     return data.charCodeAt(offset) << 24 | data.charCodeAt(offset + 1) << 16 | data.charCodeAt(offset + 2) << 8 | data.charCodeAt(offset + 3) & 0xff;
    }
    function spliceString(s, offset, remove, insert) {
     var chunk1 = s.substr(0, offset);
     var chunk2 = s.substr(offset + remove);
     return chunk1 + insert + chunk2;
    }
    var i, ii;
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    var ctx = canvas.getContext('2d');
    var called = 0;
    function isFontReady(name, callback) {
     called++;
     if (called > 30) {
      warn('Load test font never loaded.');
      callback();
      return;
     }
     ctx.font = '30px ' + name;
     ctx.fillText('.', 0, 20);
     var imageData = ctx.getImageData(0, 0, 1, 1);
     if (imageData.data[3] > 0) {
      callback();
      return;
     }
     setTimeout(isFontReady.bind(null, name, callback));
    }
    var loadTestFontId = 'lt' + Date.now() + this.loadTestFontId++;
    var data = this.loadTestFont;
    var COMMENT_OFFSET = 976;
    data = spliceString(data, COMMENT_OFFSET, loadTestFontId.length, loadTestFontId);
    var CFF_CHECKSUM_OFFSET = 16;
    var XXXX_VALUE = 0x58585858;
    var checksum = int32(data, CFF_CHECKSUM_OFFSET);
    for (i = 0, ii = loadTestFontId.length - 3; i < ii; i += 4) {
     checksum = checksum - XXXX_VALUE + int32(loadTestFontId, i) | 0;
    }
    if (i < loadTestFontId.length) {
     checksum = checksum - XXXX_VALUE + int32(loadTestFontId + 'XXX', i) | 0;
    }
    data = spliceString(data, CFF_CHECKSUM_OFFSET, 4, string32(checksum));
    var url = 'url(data:font/opentype;base64,' + btoa(data) + ');';
    var rule = '@font-face { font-family:"' + loadTestFontId + '";src:' + url + '}';
    this.insertRule(rule);
    var names = [];
    for (i = 0, ii = fonts.length; i < ii; i++) {
     names.push(fonts[i].loadedName);
    }
    names.push(loadTestFontId);
    var div = document.createElement('div');
    div.setAttribute('style', 'visibility: hidden;' + 'width: 10px; height: 10px;' + 'position: absolute; top: 0px; left: 0px;');
    for (i = 0, ii = names.length; i < ii; ++i) {
     var span = document.createElement('span');
     span.textContent = 'Hi';
     span.style.fontFamily = names[i];
     div.appendChild(span);
    }
    document.body.appendChild(div);
    isFontReady(loadTestFontId, function () {
     document.body.removeChild(div);
     request.complete();
    });
   };
   FontLoader.isFontLoadingAPISupported = typeof document !== 'undefined' && !!document.fonts;
   var isSyncFontLoadingSupported = function isSyncFontLoadingSupported() {
    if (typeof navigator === 'undefined') {
     return true;
    }
    var supported = false;
    var m = /Mozilla\/5.0.*?rv:(\d+).*? Gecko/.exec(navigator.userAgent);
    if (m && m[1] >= 14) {
     supported = true;
    }
    return supported;
   };
   Object.defineProperty(FontLoader, 'isSyncFontLoadingSupported', {
    get: function () {
     return shadow(FontLoader, 'isSyncFontLoadingSupported', isSyncFontLoadingSupported());
    },
    enumerable: true,
    configurable: true
   });
   var IsEvalSupportedCached = {
    get value() {
     return shadow(this, 'value', sharedUtil.isEvalSupported());
    }
   };
   var FontFaceObject = function FontFaceObjectClosure() {
    function FontFaceObject(translatedData, options) {
     this.compiledGlyphs = Object.create(null);
     for (var i in translatedData) {
      this[i] = translatedData[i];
     }
     this.options = options;
    }
    FontFaceObject.prototype = {
     createNativeFontFace: function FontFaceObject_createNativeFontFace() {
      if (!this.data) {
       return null;
      }
      if (this.options.disableFontFace) {
       this.disableFontFace = true;
       return null;
      }
      var nativeFontFace = new FontFace(this.loadedName, this.data, {});
      if (this.options.fontRegistry) {
       this.options.fontRegistry.registerFont(this);
      }
      return nativeFontFace;
     },
     createFontFaceRule: function FontFaceObject_createFontFaceRule() {
      if (!this.data) {
       return null;
      }
      if (this.options.disableFontFace) {
       this.disableFontFace = true;
       return null;
      }
      var data = bytesToString(new Uint8Array(this.data));
      var fontName = this.loadedName;
      var url = 'url(data:' + this.mimetype + ';base64,' + btoa(data) + ');';
      var rule = '@font-face { font-family:"' + fontName + '";src:' + url + '}';
      if (this.options.fontRegistry) {
       this.options.fontRegistry.registerFont(this, url);
      }
      return rule;
     },
     getPathGenerator: function FontFaceObject_getPathGenerator(objs, character) {
      if (!(character in this.compiledGlyphs)) {
       var cmds = objs.get(this.loadedName + '_path_' + character);
       var current, i, len;
       if (this.options.isEvalSupported && IsEvalSupportedCached.value) {
        var args, js = '';
        for (i = 0, len = cmds.length; i < len; i++) {
         current = cmds[i];
         if (current.args !== undefined) {
          args = current.args.join(',');
         } else {
          args = '';
         }
         js += 'c.' + current.cmd + '(' + args + ');\n';
        }
        this.compiledGlyphs[character] = new Function('c', 'size', js);
       } else {
        this.compiledGlyphs[character] = function (c, size) {
         for (i = 0, len = cmds.length; i < len; i++) {
          current = cmds[i];
          if (current.cmd === 'scale') {
           current.args = [
            size,
            -size
           ];
          }
          c[current.cmd].apply(c, current.args);
         }
        };
       }
      }
      return this.compiledGlyphs[character];
     }
    };
    return FontFaceObject;
   }();
   exports.FontFaceObject = FontFaceObject;
   exports.FontLoader = FontLoader;
  }));
  'use strict';
  (function (root, factory) {
   factory(root.pdfjsDisplayForms = {}, root.pdfjsSharedUtil, root.pdfjsSharedGlobal);
  }(this, function (exports, sharedUtil, sharedGlobal) {
   var Util = sharedUtil.Util;
   var createPromiseCapability = sharedUtil.createPromiseCapability;
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
     debugger;
     if (item.fullName.indexOf('.`') != -1) {
      prop.correctedId = item.fullName.substring(0, item.fullName.indexOf('.`'));
      prop.isGroupMember = true;
     } else {
      prop.correctedId = item.fullName;
      prop.isGroupMember = false;
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
     if (item.fullName in values) {
      value = values[item.fullName];
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
     if (item.fullName in values) {
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
     return control;
    };
    defaultCreationRoutines[fieldTypes.DROP_DOWN] = function (itemProperties, viewport) {
     var control = document.createElement('select');
     if (itemProperties.multiSelect)
      control.multiple = true;
     control.style.width = Math.floor(itemProperties.width - 3) + 'px';
     control.style.height = Math.floor(itemProperties.height) + 'px';
     control.style.textAlign = itemProperties.textAlignment;
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
          formFields[fieldType][fieldData.correctedId] = control;
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
         elements.push(item.fullName);
        }
       });
      });
      return elements;
     }
    };
   }();
   exports.FormFunctionality = FormFunctionality;
  }));
  (function (root, factory) {
   factory(root.pdfjsDisplayMetadata = {}, root.pdfjsSharedUtil);
  }(this, function (exports, sharedUtil) {
   var error = sharedUtil.error;
   function fixMetadata(meta) {
    return meta.replace(/>\\376\\377([^<]+)/g, function (all, codes) {
     var bytes = codes.replace(/\\([0-3])([0-7])([0-7])/g, function (code, d1, d2, d3) {
      return String.fromCharCode(d1 * 64 + d2 * 8 + d3 * 1);
     });
     var chars = '';
     for (var i = 0; i < bytes.length; i += 2) {
      var code = bytes.charCodeAt(i) * 256 + bytes.charCodeAt(i + 1);
      chars += code >= 32 && code < 127 && code !== 60 && code !== 62 && code !== 38 && false ? String.fromCharCode(code) : '&#x' + (0x10000 + code).toString(16).substring(1) + ';';
     }
     return '>' + chars;
    });
   }
   function Metadata(meta) {
    if (typeof meta === 'string') {
     meta = fixMetadata(meta);
     var parser = new DOMParser();
     meta = parser.parseFromString(meta, 'application/xml');
    } else if (!(meta instanceof Document)) {
     error('Metadata: Invalid metadata object');
    }
    this.metaDocument = meta;
    this.metadata = Object.create(null);
    this.parse();
   }
   Metadata.prototype = {
    parse: function Metadata_parse() {
     var doc = this.metaDocument;
     var rdf = doc.documentElement;
     if (rdf.nodeName.toLowerCase() !== 'rdf:rdf') {
      rdf = rdf.firstChild;
      while (rdf && rdf.nodeName.toLowerCase() !== 'rdf:rdf') {
       rdf = rdf.nextSibling;
      }
     }
     var nodeName = rdf ? rdf.nodeName.toLowerCase() : null;
     if (!rdf || nodeName !== 'rdf:rdf' || !rdf.hasChildNodes()) {
      return;
     }
     var children = rdf.childNodes, desc, entry, name, i, ii, length, iLength;
     for (i = 0, length = children.length; i < length; i++) {
      desc = children[i];
      if (desc.nodeName.toLowerCase() !== 'rdf:description') {
       continue;
      }
      for (ii = 0, iLength = desc.childNodes.length; ii < iLength; ii++) {
       if (desc.childNodes[ii].nodeName.toLowerCase() !== '#text') {
        entry = desc.childNodes[ii];
        name = entry.nodeName.toLowerCase();
        this.metadata[name] = entry.textContent.trim();
       }
      }
     }
    },
    get: function Metadata_get(name) {
     return this.metadata[name] || null;
    },
    has: function Metadata_has(name) {
     return typeof this.metadata[name] !== 'undefined';
    }
   };
   exports.Metadata = Metadata;
  }));
  (function (root, factory) {
   factory(root.pdfjsDisplaySVG = {}, root.pdfjsSharedUtil);
  }(this, function (exports, sharedUtil) {
   var FONT_IDENTITY_MATRIX = sharedUtil.FONT_IDENTITY_MATRIX;
   var IDENTITY_MATRIX = sharedUtil.IDENTITY_MATRIX;
   var ImageKind = sharedUtil.ImageKind;
   var OPS = sharedUtil.OPS;
   var Util = sharedUtil.Util;
   var isNum = sharedUtil.isNum;
   var isArray = sharedUtil.isArray;
   var warn = sharedUtil.warn;
   var createObjectURL = sharedUtil.createObjectURL;
   var SVG_DEFAULTS = {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fillColor: '#000000'
   };
   var convertImgDataToPng = function convertImgDataToPngClosure() {
    var PNG_HEADER = new Uint8Array([
     0x89,
     0x50,
     0x4e,
     0x47,
     0x0d,
     0x0a,
     0x1a,
     0x0a
    ]);
    var CHUNK_WRAPPER_SIZE = 12;
    var crcTable = new Int32Array(256);
    for (var i = 0; i < 256; i++) {
     var c = i;
     for (var h = 0; h < 8; h++) {
      if (c & 1) {
       c = 0xedB88320 ^ c >> 1 & 0x7fffffff;
      } else {
       c = c >> 1 & 0x7fffffff;
      }
     }
     crcTable[i] = c;
    }
    function crc32(data, start, end) {
     var crc = -1;
     for (var i = start; i < end; i++) {
      var a = (crc ^ data[i]) & 0xff;
      var b = crcTable[a];
      crc = crc >>> 8 ^ b;
     }
     return crc ^ -1;
    }
    function writePngChunk(type, body, data, offset) {
     var p = offset;
     var len = body.length;
     data[p] = len >> 24 & 0xff;
     data[p + 1] = len >> 16 & 0xff;
     data[p + 2] = len >> 8 & 0xff;
     data[p + 3] = len & 0xff;
     p += 4;
     data[p] = type.charCodeAt(0) & 0xff;
     data[p + 1] = type.charCodeAt(1) & 0xff;
     data[p + 2] = type.charCodeAt(2) & 0xff;
     data[p + 3] = type.charCodeAt(3) & 0xff;
     p += 4;
     data.set(body, p);
     p += body.length;
     var crc = crc32(data, offset + 4, p);
     data[p] = crc >> 24 & 0xff;
     data[p + 1] = crc >> 16 & 0xff;
     data[p + 2] = crc >> 8 & 0xff;
     data[p + 3] = crc & 0xff;
    }
    function adler32(data, start, end) {
     var a = 1;
     var b = 0;
     for (var i = start; i < end; ++i) {
      a = (a + (data[i] & 0xff)) % 65521;
      b = (b + a) % 65521;
     }
     return b << 16 | a;
    }
    function encode(imgData, kind, forceDataSchema) {
     var width = imgData.width;
     var height = imgData.height;
     var bitDepth, colorType, lineSize;
     var bytes = imgData.data;
     switch (kind) {
     case ImageKind.GRAYSCALE_1BPP:
      colorType = 0;
      bitDepth = 1;
      lineSize = width + 7 >> 3;
      break;
     case ImageKind.RGB_24BPP:
      colorType = 2;
      bitDepth = 8;
      lineSize = width * 3;
      break;
     case ImageKind.RGBA_32BPP:
      colorType = 6;
      bitDepth = 8;
      lineSize = width * 4;
      break;
     default:
      throw new Error('invalid format');
     }
     var literals = new Uint8Array((1 + lineSize) * height);
     var offsetLiterals = 0, offsetBytes = 0;
     var y, i;
     for (y = 0; y < height; ++y) {
      literals[offsetLiterals++] = 0;
      literals.set(bytes.subarray(offsetBytes, offsetBytes + lineSize), offsetLiterals);
      offsetBytes += lineSize;
      offsetLiterals += lineSize;
     }
     if (kind === ImageKind.GRAYSCALE_1BPP) {
      offsetLiterals = 0;
      for (y = 0; y < height; y++) {
       offsetLiterals++;
       for (i = 0; i < lineSize; i++) {
        literals[offsetLiterals++] ^= 0xFF;
       }
      }
     }
     var ihdr = new Uint8Array([
      width >> 24 & 0xff,
      width >> 16 & 0xff,
      width >> 8 & 0xff,
      width & 0xff,
      height >> 24 & 0xff,
      height >> 16 & 0xff,
      height >> 8 & 0xff,
      height & 0xff,
      bitDepth,
      colorType,
      0x00,
      0x00,
      0x00
     ]);
     var len = literals.length;
     var maxBlockLength = 0xFFFF;
     var deflateBlocks = Math.ceil(len / maxBlockLength);
     var idat = new Uint8Array(2 + len + deflateBlocks * 5 + 4);
     var pi = 0;
     idat[pi++] = 0x78;
     idat[pi++] = 0x9c;
     var pos = 0;
     while (len > maxBlockLength) {
      idat[pi++] = 0x00;
      idat[pi++] = 0xff;
      idat[pi++] = 0xff;
      idat[pi++] = 0x00;
      idat[pi++] = 0x00;
      idat.set(literals.subarray(pos, pos + maxBlockLength), pi);
      pi += maxBlockLength;
      pos += maxBlockLength;
      len -= maxBlockLength;
     }
     idat[pi++] = 0x01;
     idat[pi++] = len & 0xff;
     idat[pi++] = len >> 8 & 0xff;
     idat[pi++] = ~len & 0xffff & 0xff;
     idat[pi++] = (~len & 0xffff) >> 8 & 0xff;
     idat.set(literals.subarray(pos), pi);
     pi += literals.length - pos;
     var adler = adler32(literals, 0, literals.length);
     idat[pi++] = adler >> 24 & 0xff;
     idat[pi++] = adler >> 16 & 0xff;
     idat[pi++] = adler >> 8 & 0xff;
     idat[pi++] = adler & 0xff;
     var pngLength = PNG_HEADER.length + CHUNK_WRAPPER_SIZE * 3 + ihdr.length + idat.length;
     var data = new Uint8Array(pngLength);
     var offset = 0;
     data.set(PNG_HEADER, offset);
     offset += PNG_HEADER.length;
     writePngChunk('IHDR', ihdr, data, offset);
     offset += CHUNK_WRAPPER_SIZE + ihdr.length;
     writePngChunk('IDATA', idat, data, offset);
     offset += CHUNK_WRAPPER_SIZE + idat.length;
     writePngChunk('IEND', new Uint8Array(0), data, offset);
     return createObjectURL(data, 'image/png', forceDataSchema);
    }
    return function convertImgDataToPng(imgData, forceDataSchema) {
     var kind = imgData.kind === undefined ? ImageKind.GRAYSCALE_1BPP : imgData.kind;
     return encode(imgData, kind, forceDataSchema);
    };
   }();
   var SVGExtraState = function SVGExtraStateClosure() {
    function SVGExtraState() {
     this.fontSizeScale = 1;
     this.fontWeight = SVG_DEFAULTS.fontWeight;
     this.fontSize = 0;
     this.textMatrix = IDENTITY_MATRIX;
     this.fontMatrix = FONT_IDENTITY_MATRIX;
     this.leading = 0;
     this.x = 0;
     this.y = 0;
     this.lineX = 0;
     this.lineY = 0;
     this.charSpacing = 0;
     this.wordSpacing = 0;
     this.textHScale = 1;
     this.textRise = 0;
     this.fillColor = SVG_DEFAULTS.fillColor;
     this.strokeColor = '#000000';
     this.fillAlpha = 1;
     this.strokeAlpha = 1;
     this.lineWidth = 1;
     this.lineJoin = '';
     this.lineCap = '';
     this.miterLimit = 0;
     this.dashArray = [];
     this.dashPhase = 0;
     this.dependencies = [];
     this.activeClipUrl = null;
     this.clipGroup = null;
     this.maskId = '';
    }
    SVGExtraState.prototype = {
     clone: function SVGExtraState_clone() {
      return Object.create(this);
     },
     setCurrentPoint: function SVGExtraState_setCurrentPoint(x, y) {
      this.x = x;
      this.y = y;
     }
    };
    return SVGExtraState;
   }();
   var SVGGraphics = function SVGGraphicsClosure() {
    function opListToTree(opList) {
     var opTree = [];
     var tmp = [];
     var opListLen = opList.length;
     for (var x = 0; x < opListLen; x++) {
      if (opList[x].fn === 'save') {
       opTree.push({
        'fnId': 92,
        'fn': 'group',
        'items': []
       });
       tmp.push(opTree);
       opTree = opTree[opTree.length - 1].items;
       continue;
      }
      if (opList[x].fn === 'restore') {
       opTree = tmp.pop();
      } else {
       opTree.push(opList[x]);
      }
     }
     return opTree;
    }
    function pf(value) {
     if (value === (value | 0)) {
      return value.toString();
     }
     var s = value.toFixed(10);
     var i = s.length - 1;
     if (s[i] !== '0') {
      return s;
     }
     do {
      i--;
     } while (s[i] === '0');
     return s.substr(0, s[i] === '.' ? i : i + 1);
    }
    function pm(m) {
     if (m[4] === 0 && m[5] === 0) {
      if (m[1] === 0 && m[2] === 0) {
       if (m[0] === 1 && m[3] === 1) {
        return '';
       }
       return 'scale(' + pf(m[0]) + ' ' + pf(m[3]) + ')';
      }
      if (m[0] === m[3] && m[1] === -m[2]) {
       var a = Math.acos(m[0]) * 180 / Math.PI;
       return 'rotate(' + pf(a) + ')';
      }
     } else {
      if (m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1) {
       return 'translate(' + pf(m[4]) + ' ' + pf(m[5]) + ')';
      }
     }
     return 'matrix(' + pf(m[0]) + ' ' + pf(m[1]) + ' ' + pf(m[2]) + ' ' + pf(m[3]) + ' ' + pf(m[4]) + ' ' + pf(m[5]) + ')';
    }
    function SVGGraphics(commonObjs, objs, forceDataSchema) {
     this.current = new SVGExtraState();
     this.transformMatrix = IDENTITY_MATRIX;
     this.transformStack = [];
     this.extraStack = [];
     this.commonObjs = commonObjs;
     this.objs = objs;
     this.pendingEOFill = false;
     this.embedFonts = false;
     this.embeddedFonts = Object.create(null);
     this.cssStyle = null;
     this.forceDataSchema = !!forceDataSchema;
    }
    var NS = 'http://www.w3.org/2000/svg';
    var XML_NS = 'http://www.w3.org/XML/1998/namespace';
    var XLINK_NS = 'http://www.w3.org/1999/xlink';
    var LINE_CAP_STYLES = [
     'butt',
     'round',
     'square'
    ];
    var LINE_JOIN_STYLES = [
     'miter',
     'round',
     'bevel'
    ];
    var clipCount = 0;
    var maskCount = 0;
    SVGGraphics.prototype = {
     save: function SVGGraphics_save() {
      this.transformStack.push(this.transformMatrix);
      var old = this.current;
      this.extraStack.push(old);
      this.current = old.clone();
     },
     restore: function SVGGraphics_restore() {
      this.transformMatrix = this.transformStack.pop();
      this.current = this.extraStack.pop();
      this.tgrp = null;
     },
     group: function SVGGraphics_group(items) {
      this.save();
      this.executeOpTree(items);
      this.restore();
     },
     loadDependencies: function SVGGraphics_loadDependencies(operatorList) {
      var fnArray = operatorList.fnArray;
      var fnArrayLen = fnArray.length;
      var argsArray = operatorList.argsArray;
      var self = this;
      for (var i = 0; i < fnArrayLen; i++) {
       if (OPS.dependency === fnArray[i]) {
        var deps = argsArray[i];
        for (var n = 0, nn = deps.length; n < nn; n++) {
         var obj = deps[n];
         var common = obj.substring(0, 2) === 'g_';
         var promise;
         if (common) {
          promise = new Promise(function (resolve) {
           self.commonObjs.get(obj, resolve);
          });
         } else {
          promise = new Promise(function (resolve) {
           self.objs.get(obj, resolve);
          });
         }
         this.current.dependencies.push(promise);
        }
       }
      }
      return Promise.all(this.current.dependencies);
     },
     transform: function SVGGraphics_transform(a, b, c, d, e, f) {
      var transformMatrix = [
       a,
       b,
       c,
       d,
       e,
       f
      ];
      this.transformMatrix = Util.transform(this.transformMatrix, transformMatrix);
      this.tgrp = null;
     },
     getSVG: function SVGGraphics_getSVG(operatorList, viewport) {
      this.viewport = viewport;
      var svgElement = this._initialize(viewport);
      return this.loadDependencies(operatorList).then(function () {
       this.transformMatrix = IDENTITY_MATRIX;
       var opTree = this.convertOpList(operatorList);
       this.executeOpTree(opTree);
       return svgElement;
      }.bind(this));
     },
     convertOpList: function SVGGraphics_convertOpList(operatorList) {
      var argsArray = operatorList.argsArray;
      var fnArray = operatorList.fnArray;
      var fnArrayLen = fnArray.length;
      var REVOPS = [];
      var opList = [];
      for (var op in OPS) {
       REVOPS[OPS[op]] = op;
      }
      for (var x = 0; x < fnArrayLen; x++) {
       var fnId = fnArray[x];
       opList.push({
        'fnId': fnId,
        'fn': REVOPS[fnId],
        'args': argsArray[x]
       });
      }
      return opListToTree(opList);
     },
     executeOpTree: function SVGGraphics_executeOpTree(opTree) {
      var opTreeLen = opTree.length;
      for (var x = 0; x < opTreeLen; x++) {
       var fn = opTree[x].fn;
       var fnId = opTree[x].fnId;
       var args = opTree[x].args;
       switch (fnId | 0) {
       case OPS.beginText:
        this.beginText();
        break;
       case OPS.setLeading:
        this.setLeading(args);
        break;
       case OPS.setLeadingMoveText:
        this.setLeadingMoveText(args[0], args[1]);
        break;
       case OPS.setFont:
        this.setFont(args);
        break;
       case OPS.showText:
        this.showText(args[0]);
        break;
       case OPS.showSpacedText:
        this.showText(args[0]);
        break;
       case OPS.endText:
        this.endText();
        break;
       case OPS.moveText:
        this.moveText(args[0], args[1]);
        break;
       case OPS.setCharSpacing:
        this.setCharSpacing(args[0]);
        break;
       case OPS.setWordSpacing:
        this.setWordSpacing(args[0]);
        break;
       case OPS.setHScale:
        this.setHScale(args[0]);
        break;
       case OPS.setTextMatrix:
        this.setTextMatrix(args[0], args[1], args[2], args[3], args[4], args[5]);
        break;
       case OPS.setLineWidth:
        this.setLineWidth(args[0]);
        break;
       case OPS.setLineJoin:
        this.setLineJoin(args[0]);
        break;
       case OPS.setLineCap:
        this.setLineCap(args[0]);
        break;
       case OPS.setMiterLimit:
        this.setMiterLimit(args[0]);
        break;
       case OPS.setFillRGBColor:
        this.setFillRGBColor(args[0], args[1], args[2]);
        break;
       case OPS.setStrokeRGBColor:
        this.setStrokeRGBColor(args[0], args[1], args[2]);
        break;
       case OPS.setDash:
        this.setDash(args[0], args[1]);
        break;
       case OPS.setGState:
        this.setGState(args[0]);
        break;
       case OPS.fill:
        this.fill();
        break;
       case OPS.eoFill:
        this.eoFill();
        break;
       case OPS.stroke:
        this.stroke();
        break;
       case OPS.fillStroke:
        this.fillStroke();
        break;
       case OPS.eoFillStroke:
        this.eoFillStroke();
        break;
       case OPS.clip:
        this.clip('nonzero');
        break;
       case OPS.eoClip:
        this.clip('evenodd');
        break;
       case OPS.paintSolidColorImageMask:
        this.paintSolidColorImageMask();
        break;
       case OPS.paintJpegXObject:
        this.paintJpegXObject(args[0], args[1], args[2]);
        break;
       case OPS.paintImageXObject:
        this.paintImageXObject(args[0]);
        break;
       case OPS.paintInlineImageXObject:
        this.paintInlineImageXObject(args[0]);
        break;
       case OPS.paintImageMaskXObject:
        this.paintImageMaskXObject(args[0]);
        break;
       case OPS.paintFormXObjectBegin:
        this.paintFormXObjectBegin(args[0], args[1]);
        break;
       case OPS.paintFormXObjectEnd:
        this.paintFormXObjectEnd();
        break;
       case OPS.closePath:
        this.closePath();
        break;
       case OPS.closeStroke:
        this.closeStroke();
        break;
       case OPS.closeFillStroke:
        this.closeFillStroke();
        break;
       case OPS.nextLine:
        this.nextLine();
        break;
       case OPS.transform:
        this.transform(args[0], args[1], args[2], args[3], args[4], args[5]);
        break;
       case OPS.constructPath:
        this.constructPath(args[0], args[1]);
        break;
       case OPS.endPath:
        this.endPath();
        break;
       case 92:
        this.group(opTree[x].items);
        break;
       default:
        warn('Unimplemented operator ' + fn);
        break;
       }
      }
     },
     setWordSpacing: function SVGGraphics_setWordSpacing(wordSpacing) {
      this.current.wordSpacing = wordSpacing;
     },
     setCharSpacing: function SVGGraphics_setCharSpacing(charSpacing) {
      this.current.charSpacing = charSpacing;
     },
     nextLine: function SVGGraphics_nextLine() {
      this.moveText(0, this.current.leading);
     },
     setTextMatrix: function SVGGraphics_setTextMatrix(a, b, c, d, e, f) {
      var current = this.current;
      this.current.textMatrix = this.current.lineMatrix = [
       a,
       b,
       c,
       d,
       e,
       f
      ];
      this.current.x = this.current.lineX = 0;
      this.current.y = this.current.lineY = 0;
      current.xcoords = [];
      current.tspan = document.createElementNS(NS, 'svg:tspan');
      current.tspan.setAttributeNS(null, 'font-family', current.fontFamily);
      current.tspan.setAttributeNS(null, 'font-size', pf(current.fontSize) + 'px');
      current.tspan.setAttributeNS(null, 'y', pf(-current.y));
      current.txtElement = document.createElementNS(NS, 'svg:text');
      current.txtElement.appendChild(current.tspan);
     },
     beginText: function SVGGraphics_beginText() {
      this.current.x = this.current.lineX = 0;
      this.current.y = this.current.lineY = 0;
      this.current.textMatrix = IDENTITY_MATRIX;
      this.current.lineMatrix = IDENTITY_MATRIX;
      this.current.tspan = document.createElementNS(NS, 'svg:tspan');
      this.current.txtElement = document.createElementNS(NS, 'svg:text');
      this.current.txtgrp = document.createElementNS(NS, 'svg:g');
      this.current.xcoords = [];
     },
     moveText: function SVGGraphics_moveText(x, y) {
      var current = this.current;
      this.current.x = this.current.lineX += x;
      this.current.y = this.current.lineY += y;
      current.xcoords = [];
      current.tspan = document.createElementNS(NS, 'svg:tspan');
      current.tspan.setAttributeNS(null, 'font-family', current.fontFamily);
      current.tspan.setAttributeNS(null, 'font-size', pf(current.fontSize) + 'px');
      current.tspan.setAttributeNS(null, 'y', pf(-current.y));
     },
     showText: function SVGGraphics_showText(glyphs) {
      var current = this.current;
      var font = current.font;
      var fontSize = current.fontSize;
      if (fontSize === 0) {
       return;
      }
      var charSpacing = current.charSpacing;
      var wordSpacing = current.wordSpacing;
      var fontDirection = current.fontDirection;
      var textHScale = current.textHScale * fontDirection;
      var glyphsLength = glyphs.length;
      var vertical = font.vertical;
      var widthAdvanceScale = fontSize * current.fontMatrix[0];
      var x = 0, i;
      for (i = 0; i < glyphsLength; ++i) {
       var glyph = glyphs[i];
       if (glyph === null) {
        x += fontDirection * wordSpacing;
        continue;
       } else if (isNum(glyph)) {
        x += -glyph * fontSize * 0.001;
        continue;
       }
       current.xcoords.push(current.x + x * textHScale);
       var width = glyph.width;
       var character = glyph.fontChar;
       var charWidth = width * widthAdvanceScale + charSpacing * fontDirection;
       x += charWidth;
       current.tspan.textContent += character;
      }
      if (vertical) {
       current.y -= x * textHScale;
      } else {
       current.x += x * textHScale;
      }
      current.tspan.setAttributeNS(null, 'x', current.xcoords.map(pf).join(' '));
      current.tspan.setAttributeNS(null, 'y', pf(-current.y));
      current.tspan.setAttributeNS(null, 'font-family', current.fontFamily);
      current.tspan.setAttributeNS(null, 'font-size', pf(current.fontSize) + 'px');
      if (current.fontStyle !== SVG_DEFAULTS.fontStyle) {
       current.tspan.setAttributeNS(null, 'font-style', current.fontStyle);
      }
      if (current.fontWeight !== SVG_DEFAULTS.fontWeight) {
       current.tspan.setAttributeNS(null, 'font-weight', current.fontWeight);
      }
      if (current.fillColor !== SVG_DEFAULTS.fillColor) {
       current.tspan.setAttributeNS(null, 'fill', current.fillColor);
      }
      current.txtElement.setAttributeNS(null, 'transform', pm(current.textMatrix) + ' scale(1, -1)');
      current.txtElement.setAttributeNS(XML_NS, 'xml:space', 'preserve');
      current.txtElement.appendChild(current.tspan);
      current.txtgrp.appendChild(current.txtElement);
      this._ensureTransformGroup().appendChild(current.txtElement);
     },
     setLeadingMoveText: function SVGGraphics_setLeadingMoveText(x, y) {
      this.setLeading(-y);
      this.moveText(x, y);
     },
     addFontStyle: function SVGGraphics_addFontStyle(fontObj) {
      if (!this.cssStyle) {
       this.cssStyle = document.createElementNS(NS, 'svg:style');
       this.cssStyle.setAttributeNS(null, 'type', 'text/css');
       this.defs.appendChild(this.cssStyle);
      }
      var url = createObjectURL(fontObj.data, fontObj.mimetype, this.forceDataSchema);
      this.cssStyle.textContent += '@font-face { font-family: "' + fontObj.loadedName + '";' + ' src: url(' + url + '); }\n';
     },
     setFont: function SVGGraphics_setFont(details) {
      var current = this.current;
      var fontObj = this.commonObjs.get(details[0]);
      var size = details[1];
      this.current.font = fontObj;
      if (this.embedFonts && fontObj.data && !this.embeddedFonts[fontObj.loadedName]) {
       this.addFontStyle(fontObj);
       this.embeddedFonts[fontObj.loadedName] = fontObj;
      }
      current.fontMatrix = fontObj.fontMatrix ? fontObj.fontMatrix : FONT_IDENTITY_MATRIX;
      var bold = fontObj.black ? fontObj.bold ? 'bolder' : 'bold' : fontObj.bold ? 'bold' : 'normal';
      var italic = fontObj.italic ? 'italic' : 'normal';
      if (size < 0) {
       size = -size;
       current.fontDirection = -1;
      } else {
       current.fontDirection = 1;
      }
      current.fontSize = size;
      current.fontFamily = fontObj.loadedName;
      current.fontWeight = bold;
      current.fontStyle = italic;
      current.tspan = document.createElementNS(NS, 'svg:tspan');
      current.tspan.setAttributeNS(null, 'y', pf(-current.y));
      current.xcoords = [];
     },
     endText: function SVGGraphics_endText() {
     },
     setLineWidth: function SVGGraphics_setLineWidth(width) {
      this.current.lineWidth = width;
     },
     setLineCap: function SVGGraphics_setLineCap(style) {
      this.current.lineCap = LINE_CAP_STYLES[style];
     },
     setLineJoin: function SVGGraphics_setLineJoin(style) {
      this.current.lineJoin = LINE_JOIN_STYLES[style];
     },
     setMiterLimit: function SVGGraphics_setMiterLimit(limit) {
      this.current.miterLimit = limit;
     },
     setStrokeRGBColor: function SVGGraphics_setStrokeRGBColor(r, g, b) {
      var color = Util.makeCssRgb(r, g, b);
      this.current.strokeColor = color;
     },
     setFillRGBColor: function SVGGraphics_setFillRGBColor(r, g, b) {
      var color = Util.makeCssRgb(r, g, b);
      this.current.fillColor = color;
      this.current.tspan = document.createElementNS(NS, 'svg:tspan');
      this.current.xcoords = [];
     },
     setDash: function SVGGraphics_setDash(dashArray, dashPhase) {
      this.current.dashArray = dashArray;
      this.current.dashPhase = dashPhase;
     },
     constructPath: function SVGGraphics_constructPath(ops, args) {
      var current = this.current;
      var x = current.x, y = current.y;
      current.path = document.createElementNS(NS, 'svg:path');
      var d = [];
      var opLength = ops.length;
      for (var i = 0, j = 0; i < opLength; i++) {
       switch (ops[i] | 0) {
       case OPS.rectangle:
        x = args[j++];
        y = args[j++];
        var width = args[j++];
        var height = args[j++];
        var xw = x + width;
        var yh = y + height;
        d.push('M', pf(x), pf(y), 'L', pf(xw), pf(y), 'L', pf(xw), pf(yh), 'L', pf(x), pf(yh), 'Z');
        break;
       case OPS.moveTo:
        x = args[j++];
        y = args[j++];
        d.push('M', pf(x), pf(y));
        break;
       case OPS.lineTo:
        x = args[j++];
        y = args[j++];
        d.push('L', pf(x), pf(y));
        break;
       case OPS.curveTo:
        x = args[j + 4];
        y = args[j + 5];
        d.push('C', pf(args[j]), pf(args[j + 1]), pf(args[j + 2]), pf(args[j + 3]), pf(x), pf(y));
        j += 6;
        break;
       case OPS.curveTo2:
        x = args[j + 2];
        y = args[j + 3];
        d.push('C', pf(x), pf(y), pf(args[j]), pf(args[j + 1]), pf(args[j + 2]), pf(args[j + 3]));
        j += 4;
        break;
       case OPS.curveTo3:
        x = args[j + 2];
        y = args[j + 3];
        d.push('C', pf(args[j]), pf(args[j + 1]), pf(x), pf(y), pf(x), pf(y));
        j += 4;
        break;
       case OPS.closePath:
        d.push('Z');
        break;
       }
      }
      current.path.setAttributeNS(null, 'd', d.join(' '));
      current.path.setAttributeNS(null, 'stroke-miterlimit', pf(current.miterLimit));
      current.path.setAttributeNS(null, 'stroke-linecap', current.lineCap);
      current.path.setAttributeNS(null, 'stroke-linejoin', current.lineJoin);
      current.path.setAttributeNS(null, 'stroke-width', pf(current.lineWidth) + 'px');
      current.path.setAttributeNS(null, 'stroke-dasharray', current.dashArray.map(pf).join(' '));
      current.path.setAttributeNS(null, 'stroke-dashoffset', pf(current.dashPhase) + 'px');
      current.path.setAttributeNS(null, 'fill', 'none');
      this._ensureTransformGroup().appendChild(current.path);
      current.element = current.path;
      current.setCurrentPoint(x, y);
     },
     endPath: function SVGGraphics_endPath() {
     },
     clip: function SVGGraphics_clip(type) {
      var current = this.current;
      var clipId = 'clippath' + clipCount;
      clipCount++;
      var clipPath = document.createElementNS(NS, 'svg:clipPath');
      clipPath.setAttributeNS(null, 'id', clipId);
      clipPath.setAttributeNS(null, 'transform', pm(this.transformMatrix));
      var clipElement = current.element.cloneNode();
      if (type === 'evenodd') {
       clipElement.setAttributeNS(null, 'clip-rule', 'evenodd');
      } else {
       clipElement.setAttributeNS(null, 'clip-rule', 'nonzero');
      }
      clipPath.appendChild(clipElement);
      this.defs.appendChild(clipPath);
      if (current.activeClipUrl) {
       current.clipGroup = null;
       this.extraStack.forEach(function (prev) {
        prev.clipGroup = null;
       });
      }
      current.activeClipUrl = 'url(#' + clipId + ')';
      this.tgrp = null;
     },
     closePath: function SVGGraphics_closePath() {
      var current = this.current;
      var d = current.path.getAttributeNS(null, 'd');
      d += 'Z';
      current.path.setAttributeNS(null, 'd', d);
     },
     setLeading: function SVGGraphics_setLeading(leading) {
      this.current.leading = -leading;
     },
     setTextRise: function SVGGraphics_setTextRise(textRise) {
      this.current.textRise = textRise;
     },
     setHScale: function SVGGraphics_setHScale(scale) {
      this.current.textHScale = scale / 100;
     },
     setGState: function SVGGraphics_setGState(states) {
      for (var i = 0, ii = states.length; i < ii; i++) {
       var state = states[i];
       var key = state[0];
       var value = state[1];
       switch (key) {
       case 'LW':
        this.setLineWidth(value);
        break;
       case 'LC':
        this.setLineCap(value);
        break;
       case 'LJ':
        this.setLineJoin(value);
        break;
       case 'ML':
        this.setMiterLimit(value);
        break;
       case 'D':
        this.setDash(value[0], value[1]);
        break;
       case 'Font':
        this.setFont(value);
        break;
       default:
        warn('Unimplemented graphic state ' + key);
        break;
       }
      }
     },
     fill: function SVGGraphics_fill() {
      var current = this.current;
      current.element.setAttributeNS(null, 'fill', current.fillColor);
     },
     stroke: function SVGGraphics_stroke() {
      var current = this.current;
      current.element.setAttributeNS(null, 'stroke', current.strokeColor);
      current.element.setAttributeNS(null, 'fill', 'none');
     },
     eoFill: function SVGGraphics_eoFill() {
      var current = this.current;
      current.element.setAttributeNS(null, 'fill', current.fillColor);
      current.element.setAttributeNS(null, 'fill-rule', 'evenodd');
     },
     fillStroke: function SVGGraphics_fillStroke() {
      this.stroke();
      this.fill();
     },
     eoFillStroke: function SVGGraphics_eoFillStroke() {
      this.current.element.setAttributeNS(null, 'fill-rule', 'evenodd');
      this.fillStroke();
     },
     closeStroke: function SVGGraphics_closeStroke() {
      this.closePath();
      this.stroke();
     },
     closeFillStroke: function SVGGraphics_closeFillStroke() {
      this.closePath();
      this.fillStroke();
     },
     paintSolidColorImageMask: function SVGGraphics_paintSolidColorImageMask() {
      var current = this.current;
      var rect = document.createElementNS(NS, 'svg:rect');
      rect.setAttributeNS(null, 'x', '0');
      rect.setAttributeNS(null, 'y', '0');
      rect.setAttributeNS(null, 'width', '1px');
      rect.setAttributeNS(null, 'height', '1px');
      rect.setAttributeNS(null, 'fill', current.fillColor);
      this._ensureTransformGroup().appendChild(rect);
     },
     paintJpegXObject: function SVGGraphics_paintJpegXObject(objId, w, h) {
      var imgObj = this.objs.get(objId);
      var imgEl = document.createElementNS(NS, 'svg:image');
      imgEl.setAttributeNS(XLINK_NS, 'xlink:href', imgObj.src);
      imgEl.setAttributeNS(null, 'width', imgObj.width + 'px');
      imgEl.setAttributeNS(null, 'height', imgObj.height + 'px');
      imgEl.setAttributeNS(null, 'x', '0');
      imgEl.setAttributeNS(null, 'y', pf(-h));
      imgEl.setAttributeNS(null, 'transform', 'scale(' + pf(1 / w) + ' ' + pf(-1 / h) + ')');
      this._ensureTransformGroup().appendChild(imgEl);
     },
     paintImageXObject: function SVGGraphics_paintImageXObject(objId) {
      var imgData = this.objs.get(objId);
      if (!imgData) {
       warn('Dependent image isn\'t ready yet');
       return;
      }
      this.paintInlineImageXObject(imgData);
     },
     paintInlineImageXObject: function SVGGraphics_paintInlineImageXObject(imgData, mask) {
      var width = imgData.width;
      var height = imgData.height;
      var imgSrc = convertImgDataToPng(imgData, this.forceDataSchema);
      var cliprect = document.createElementNS(NS, 'svg:rect');
      cliprect.setAttributeNS(null, 'x', '0');
      cliprect.setAttributeNS(null, 'y', '0');
      cliprect.setAttributeNS(null, 'width', pf(width));
      cliprect.setAttributeNS(null, 'height', pf(height));
      this.current.element = cliprect;
      this.clip('nonzero');
      var imgEl = document.createElementNS(NS, 'svg:image');
      imgEl.setAttributeNS(XLINK_NS, 'xlink:href', imgSrc);
      imgEl.setAttributeNS(null, 'x', '0');
      imgEl.setAttributeNS(null, 'y', pf(-height));
      imgEl.setAttributeNS(null, 'width', pf(width) + 'px');
      imgEl.setAttributeNS(null, 'height', pf(height) + 'px');
      imgEl.setAttributeNS(null, 'transform', 'scale(' + pf(1 / width) + ' ' + pf(-1 / height) + ')');
      if (mask) {
       mask.appendChild(imgEl);
      } else {
       this._ensureTransformGroup().appendChild(imgEl);
      }
     },
     paintImageMaskXObject: function SVGGraphics_paintImageMaskXObject(imgData) {
      var current = this.current;
      var width = imgData.width;
      var height = imgData.height;
      var fillColor = current.fillColor;
      current.maskId = 'mask' + maskCount++;
      var mask = document.createElementNS(NS, 'svg:mask');
      mask.setAttributeNS(null, 'id', current.maskId);
      var rect = document.createElementNS(NS, 'svg:rect');
      rect.setAttributeNS(null, 'x', '0');
      rect.setAttributeNS(null, 'y', '0');
      rect.setAttributeNS(null, 'width', pf(width));
      rect.setAttributeNS(null, 'height', pf(height));
      rect.setAttributeNS(null, 'fill', fillColor);
      rect.setAttributeNS(null, 'mask', 'url(#' + current.maskId + ')');
      this.defs.appendChild(mask);
      this._ensureTransformGroup().appendChild(rect);
      this.paintInlineImageXObject(imgData, mask);
     },
     paintFormXObjectBegin: function SVGGraphics_paintFormXObjectBegin(matrix, bbox) {
      if (isArray(matrix) && matrix.length === 6) {
       this.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
      }
      if (isArray(bbox) && bbox.length === 4) {
       var width = bbox[2] - bbox[0];
       var height = bbox[3] - bbox[1];
       var cliprect = document.createElementNS(NS, 'svg:rect');
       cliprect.setAttributeNS(null, 'x', bbox[0]);
       cliprect.setAttributeNS(null, 'y', bbox[1]);
       cliprect.setAttributeNS(null, 'width', pf(width));
       cliprect.setAttributeNS(null, 'height', pf(height));
       this.current.element = cliprect;
       this.clip('nonzero');
       this.endPath();
      }
     },
     paintFormXObjectEnd: function SVGGraphics_paintFormXObjectEnd() {
     },
     _initialize: function SVGGraphics_initialize(viewport) {
      var svg = document.createElementNS(NS, 'svg:svg');
      svg.setAttributeNS(null, 'version', '1.1');
      svg.setAttributeNS(null, 'width', viewport.width + 'px');
      svg.setAttributeNS(null, 'height', viewport.height + 'px');
      svg.setAttributeNS(null, 'preserveAspectRatio', 'none');
      svg.setAttributeNS(null, 'viewBox', '0 0 ' + viewport.width + ' ' + viewport.height);
      var definitions = document.createElementNS(NS, 'svg:defs');
      svg.appendChild(definitions);
      this.defs = definitions;
      var rootGroup = document.createElementNS(NS, 'svg:g');
      rootGroup.setAttributeNS(null, 'transform', pm(viewport.transform));
      svg.appendChild(rootGroup);
      this.svg = rootGroup;
      return svg;
     },
     _ensureClipGroup: function SVGGraphics_ensureClipGroup() {
      if (!this.current.clipGroup) {
       var clipGroup = document.createElementNS(NS, 'svg:g');
       clipGroup.setAttributeNS(null, 'clip-path', this.current.activeClipUrl);
       this.svg.appendChild(clipGroup);
       this.current.clipGroup = clipGroup;
      }
      return this.current.clipGroup;
     },
     _ensureTransformGroup: function SVGGraphics_ensureTransformGroup() {
      if (!this.tgrp) {
       this.tgrp = document.createElementNS(NS, 'svg:g');
       this.tgrp.setAttributeNS(null, 'transform', pm(this.transformMatrix));
       if (this.current.activeClipUrl) {
        this._ensureClipGroup().appendChild(this.tgrp);
       } else {
        this.svg.appendChild(this.tgrp);
       }
      }
      return this.tgrp;
     }
    };
    return SVGGraphics;
   }();
   exports.SVGGraphics = SVGGraphics;
  }));
  (function (root, factory) {
   factory(root.pdfjsDisplayAnnotationLayer = {}, root.pdfjsSharedUtil, root.pdfjsDisplayDOMUtils);
  }(this, function (exports, sharedUtil, displayDOMUtils) {
   var AnnotationBorderStyleType = sharedUtil.AnnotationBorderStyleType;
   var AnnotationType = sharedUtil.AnnotationType;
   var Util = sharedUtil.Util;
   var addLinkAttributes = displayDOMUtils.addLinkAttributes;
   var LinkTarget = displayDOMUtils.LinkTarget;
   var getFilenameFromUrl = displayDOMUtils.getFilenameFromUrl;
   var warn = sharedUtil.warn;
   var CustomStyle = displayDOMUtils.CustomStyle;
   var getDefaultSetting = displayDOMUtils.getDefaultSetting;
   function AnnotationElementFactory() {
   }
   AnnotationElementFactory.prototype = {
    create: function AnnotationElementFactory_create(parameters) {
     var subtype = parameters.data.annotationType;
     switch (subtype) {
     case AnnotationType.LINK:
      return new LinkAnnotationElement(parameters);
     case AnnotationType.TEXT:
      return new TextAnnotationElement(parameters);
     case AnnotationType.WIDGET:
      var fieldType = parameters.data.fieldType;
      switch (fieldType) {
      case 'Tx':
       return new TextWidgetAnnotationElement(parameters);
      case 'Ch':
       return new ChoiceWidgetAnnotationElement(parameters);
      }
      return new WidgetAnnotationElement(parameters);
     case AnnotationType.POPUP:
      return new PopupAnnotationElement(parameters);
     case AnnotationType.HIGHLIGHT:
      return new HighlightAnnotationElement(parameters);
     case AnnotationType.UNDERLINE:
      return new UnderlineAnnotationElement(parameters);
     case AnnotationType.SQUIGGLY:
      return new SquigglyAnnotationElement(parameters);
     case AnnotationType.STRIKEOUT:
      return new StrikeOutAnnotationElement(parameters);
     case AnnotationType.FILEATTACHMENT:
      return new FileAttachmentAnnotationElement(parameters);
     default:
      return new AnnotationElement(parameters);
     }
    }
   };
   var AnnotationElement = function AnnotationElementClosure() {
    function AnnotationElement(parameters, isRenderable) {
     this.isRenderable = isRenderable || false;
     this.data = parameters.data;
     this.layer = parameters.layer;
     this.page = parameters.page;
     this.viewport = parameters.viewport;
     this.linkService = parameters.linkService;
     this.downloadManager = parameters.downloadManager;
     this.imageResourcesPath = parameters.imageResourcesPath;
     this.renderInteractiveForms = parameters.renderInteractiveForms;
     if (isRenderable) {
      this.container = this._createContainer();
     }
    }
    AnnotationElement.prototype = {
     _createContainer: function AnnotationElement_createContainer() {
      var data = this.data, page = this.page, viewport = this.viewport;
      var container = document.createElement('section');
      var width = data.rect[2] - data.rect[0];
      var height = data.rect[3] - data.rect[1];
      container.setAttribute('data-annotation-id', data.id);
      var rect = Util.normalizeRect([
       data.rect[0],
       page.view[3] - data.rect[1] + page.view[1],
       data.rect[2],
       page.view[3] - data.rect[3] + page.view[1]
      ]);
      CustomStyle.setProp('transform', container, 'matrix(' + viewport.transform.join(',') + ')');
      CustomStyle.setProp('transformOrigin', container, -rect[0] + 'px ' + -rect[1] + 'px');
      if (data.borderStyle.width > 0) {
       container.style.borderWidth = data.borderStyle.width + 'px';
       if (data.borderStyle.style !== AnnotationBorderStyleType.UNDERLINE) {
        width = width - 2 * data.borderStyle.width;
        height = height - 2 * data.borderStyle.width;
       }
       var horizontalRadius = data.borderStyle.horizontalCornerRadius;
       var verticalRadius = data.borderStyle.verticalCornerRadius;
       if (horizontalRadius > 0 || verticalRadius > 0) {
        var radius = horizontalRadius + 'px / ' + verticalRadius + 'px';
        CustomStyle.setProp('borderRadius', container, radius);
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
        container.style.borderColor = Util.makeCssRgb(data.color[0] | 0, data.color[1] | 0, data.color[2] | 0);
       } else {
        container.style.borderWidth = 0;
       }
      }
      container.style.left = rect[0] + 'px';
      container.style.top = rect[1] + 'px';
      container.style.width = width + 'px';
      container.style.height = height + 'px';
      return container;
     },
     _createPopup: function AnnotationElement_createPopup(container, trigger, data) {
      if (!trigger) {
       trigger = document.createElement('div');
       trigger.style.height = container.style.height;
       trigger.style.width = container.style.width;
       container.appendChild(trigger);
      }
      var popupElement = new PopupElement({
       container: container,
       trigger: trigger,
       color: data.color,
       title: data.title,
       contents: data.contents,
       hideWrapper: true
      });
      var popup = popupElement.render();
      popup.style.left = container.style.width;
      container.appendChild(popup);
     },
     render: function AnnotationElement_render() {
      throw new Error('Abstract method AnnotationElement.render called');
     }
    };
    return AnnotationElement;
   }();
   var LinkAnnotationElement = function LinkAnnotationElementClosure() {
    function LinkAnnotationElement(parameters) {
     AnnotationElement.call(this, parameters, true);
    }
    Util.inherit(LinkAnnotationElement, AnnotationElement, {
     render: function LinkAnnotationElement_render() {
      this.container.className = 'linkAnnotation';
      var link = document.createElement('a');
      addLinkAttributes(link, {
       url: this.data.url,
       target: this.data.newWindow ? LinkTarget.BLANK : undefined
      });
      if (!this.data.url) {
       if (this.data.action) {
        this._bindNamedAction(link, this.data.action);
       } else {
        this._bindLink(link, this.data.dest);
       }
      }
      this.container.appendChild(link);
      return this.container;
     },
     _bindLink: function LinkAnnotationElement_bindLink(link, destination) {
      var self = this;
      link.href = this.linkService.getDestinationHash(destination);
      link.onclick = function () {
       if (destination) {
        self.linkService.navigateTo(destination);
       }
       return false;
      };
      if (destination) {
       link.className = 'internalLink';
      }
     },
     _bindNamedAction: function LinkAnnotationElement_bindNamedAction(link, action) {
      var self = this;
      link.href = this.linkService.getAnchorUrl('');
      link.onclick = function () {
       self.linkService.executeNamedAction(action);
       return false;
      };
      link.className = 'internalLink';
     }
    });
    return LinkAnnotationElement;
   }();
   var TextAnnotationElement = function TextAnnotationElementClosure() {
    function TextAnnotationElement(parameters) {
     var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
     AnnotationElement.call(this, parameters, isRenderable);
    }
    Util.inherit(TextAnnotationElement, AnnotationElement, {
     render: function TextAnnotationElement_render() {
      this.container.className = 'textAnnotation';
      var image = document.createElement('img');
      image.style.height = this.container.style.height;
      image.style.width = this.container.style.width;
      image.src = this.imageResourcesPath + 'annotation-' + this.data.name.toLowerCase() + '.svg';
      image.alt = '[{{type}} Annotation]';
      image.dataset.l10nId = 'text_annotation_type';
      image.dataset.l10nArgs = JSON.stringify({ type: this.data.name });
      if (!this.data.hasPopup) {
       this._createPopup(this.container, image, this.data);
      }
      this.container.appendChild(image);
      return this.container;
     }
    });
    return TextAnnotationElement;
   }();
   var WidgetAnnotationElement = function WidgetAnnotationElementClosure() {
    function WidgetAnnotationElement(parameters, isRenderable) {
     AnnotationElement.call(this, parameters, isRenderable);
    }
    Util.inherit(WidgetAnnotationElement, AnnotationElement, {
     render: function WidgetAnnotationElement_render() {
      return this.container;
     }
    });
    return WidgetAnnotationElement;
   }();
   var TextWidgetAnnotationElement = function TextWidgetAnnotationElementClosure() {
    var TEXT_ALIGNMENT = [
     'left',
     'center',
     'right'
    ];
    function TextWidgetAnnotationElement(parameters) {
     var isRenderable = parameters.renderInteractiveForms || !parameters.data.hasAppearance && !!parameters.data.fieldValue;
     WidgetAnnotationElement.call(this, parameters, isRenderable);
    }
    Util.inherit(TextWidgetAnnotationElement, WidgetAnnotationElement, {
     render: function TextWidgetAnnotationElement_render() {
      this.container.className = 'textWidgetAnnotation';
      var element = null;
      if (this.renderInteractiveForms) {
       if (this.data.multiLine) {
        element = document.createElement('textarea');
        element.textContent = this.data.fieldValue;
       } else {
        element = document.createElement('input');
        element.type = 'text';
        element.setAttribute('value', this.data.fieldValue);
       }
       element.disabled = this.data.readOnly;
       if (this.data.maxLen !== null) {
        element.maxLength = this.data.maxLen;
       }
       if (this.data.comb) {
        var fieldWidth = this.data.rect[2] - this.data.rect[0];
        var combWidth = fieldWidth / this.data.maxLen;
        element.classList.add('comb');
        element.style.letterSpacing = 'calc(' + combWidth + 'px - 1ch)';
       }
      } else {
       element = document.createElement('div');
       element.textContent = this.data.fieldValue;
       element.style.verticalAlign = 'middle';
       element.style.display = 'table-cell';
       var font = null;
       if (this.data.fontRefName) {
        font = this.page.commonObjs.getData(this.data.fontRefName);
       }
       this._setTextStyle(element, font);
      }
      if (this.data.textAlignment !== null) {
       element.style.textAlign = TEXT_ALIGNMENT[this.data.textAlignment];
      }
      this.container.appendChild(element);
      return this.container;
     },
     _setTextStyle: function TextWidgetAnnotationElement_setTextStyle(element, font) {
      var style = element.style;
      style.fontSize = this.data.fontSize + 'px';
      style.direction = this.data.fontDirection < 0 ? 'rtl' : 'ltr';
      if (!font) {
       return;
      }
      style.fontWeight = font.black ? font.bold ? '900' : 'bold' : font.bold ? 'bold' : 'normal';
      style.fontStyle = font.italic ? 'italic' : 'normal';
      var fontFamily = font.loadedName ? '"' + font.loadedName + '", ' : '';
      var fallbackName = font.fallbackName || 'Helvetica, sans-serif';
      style.fontFamily = fontFamily + fallbackName;
     }
    });
    return TextWidgetAnnotationElement;
   }();
   var ChoiceWidgetAnnotationElement = function ChoiceWidgetAnnotationElementClosure() {
    function ChoiceWidgetAnnotationElement(parameters) {
     WidgetAnnotationElement.call(this, parameters, parameters.renderInteractiveForms);
    }
    Util.inherit(ChoiceWidgetAnnotationElement, WidgetAnnotationElement, {
     render: function ChoiceWidgetAnnotationElement_render() {
      this.container.className = 'choiceWidgetAnnotation';
      var selectElement = document.createElement('select');
      selectElement.disabled = this.data.readOnly;
      if (!this.data.combo) {
       selectElement.size = this.data.options.length;
       if (this.data.multiSelect) {
        selectElement.multiple = true;
       }
      }
      for (var i = 0, ii = this.data.options.length; i < ii; i++) {
       var option = this.data.options[i];
       var optionElement = document.createElement('option');
       optionElement.textContent = option.displayValue;
       optionElement.value = option.exportValue;
       if (this.data.fieldValue.indexOf(option.displayValue) >= 0) {
        optionElement.setAttribute('selected', true);
       }
       selectElement.appendChild(optionElement);
      }
      this.container.appendChild(selectElement);
      return this.container;
     }
    });
    return ChoiceWidgetAnnotationElement;
   }();
   var PopupAnnotationElement = function PopupAnnotationElementClosure() {
    function PopupAnnotationElement(parameters) {
     var isRenderable = !!(parameters.data.title || parameters.data.contents);
     AnnotationElement.call(this, parameters, isRenderable);
    }
    Util.inherit(PopupAnnotationElement, AnnotationElement, {
     render: function PopupAnnotationElement_render() {
      this.container.className = 'popupAnnotation';
      var selector = '[data-annotation-id="' + this.data.parentId + '"]';
      var parentElement = this.layer.querySelector(selector);
      if (!parentElement) {
       return this.container;
      }
      var popup = new PopupElement({
       container: this.container,
       trigger: parentElement,
       color: this.data.color,
       title: this.data.title,
       contents: this.data.contents
      });
      var parentLeft = parseFloat(parentElement.style.left);
      var parentWidth = parseFloat(parentElement.style.width);
      CustomStyle.setProp('transformOrigin', this.container, -(parentLeft + parentWidth) + 'px -' + parentElement.style.top);
      this.container.style.left = parentLeft + parentWidth + 'px';
      this.container.appendChild(popup.render());
      return this.container;
     }
    });
    return PopupAnnotationElement;
   }();
   var PopupElement = function PopupElementClosure() {
    var BACKGROUND_ENLIGHT = 0.7;
    function PopupElement(parameters) {
     this.container = parameters.container;
     this.trigger = parameters.trigger;
     this.color = parameters.color;
     this.title = parameters.title;
     this.contents = parameters.contents;
     this.hideWrapper = parameters.hideWrapper || false;
     this.pinned = false;
    }
    PopupElement.prototype = {
     render: function PopupElement_render() {
      var wrapper = document.createElement('div');
      wrapper.className = 'popupWrapper';
      this.hideElement = this.hideWrapper ? wrapper : this.container;
      this.hideElement.setAttribute('hidden', true);
      var popup = document.createElement('div');
      popup.className = 'popup';
      var color = this.color;
      if (color) {
       var r = BACKGROUND_ENLIGHT * (255 - color[0]) + color[0];
       var g = BACKGROUND_ENLIGHT * (255 - color[1]) + color[1];
       var b = BACKGROUND_ENLIGHT * (255 - color[2]) + color[2];
       popup.style.backgroundColor = Util.makeCssRgb(r | 0, g | 0, b | 0);
      }
      var contents = this._formatContents(this.contents);
      var title = document.createElement('h1');
      title.textContent = this.title;
      this.trigger.addEventListener('click', this._toggle.bind(this));
      this.trigger.addEventListener('mouseover', this._show.bind(this, false));
      this.trigger.addEventListener('mouseout', this._hide.bind(this, false));
      popup.addEventListener('click', this._hide.bind(this, true));
      popup.appendChild(title);
      popup.appendChild(contents);
      wrapper.appendChild(popup);
      return wrapper;
     },
     _formatContents: function PopupElement_formatContents(contents) {
      var p = document.createElement('p');
      var lines = contents.split(/(?:\r\n?|\n)/);
      for (var i = 0, ii = lines.length; i < ii; ++i) {
       var line = lines[i];
       p.appendChild(document.createTextNode(line));
       if (i < ii - 1) {
        p.appendChild(document.createElement('br'));
       }
      }
      return p;
     },
     _toggle: function PopupElement_toggle() {
      if (this.pinned) {
       this._hide(true);
      } else {
       this._show(true);
      }
     },
     _show: function PopupElement_show(pin) {
      if (pin) {
       this.pinned = true;
      }
      if (this.hideElement.hasAttribute('hidden')) {
       this.hideElement.removeAttribute('hidden');
       this.container.style.zIndex += 1;
      }
     },
     _hide: function PopupElement_hide(unpin) {
      if (unpin) {
       this.pinned = false;
      }
      if (!this.hideElement.hasAttribute('hidden') && !this.pinned) {
       this.hideElement.setAttribute('hidden', true);
       this.container.style.zIndex -= 1;
      }
     }
    };
    return PopupElement;
   }();
   var HighlightAnnotationElement = function HighlightAnnotationElementClosure() {
    function HighlightAnnotationElement(parameters) {
     var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
     AnnotationElement.call(this, parameters, isRenderable);
    }
    Util.inherit(HighlightAnnotationElement, AnnotationElement, {
     render: function HighlightAnnotationElement_render() {
      this.container.className = 'highlightAnnotation';
      if (!this.data.hasPopup) {
       this._createPopup(this.container, null, this.data);
      }
      return this.container;
     }
    });
    return HighlightAnnotationElement;
   }();
   var UnderlineAnnotationElement = function UnderlineAnnotationElementClosure() {
    function UnderlineAnnotationElement(parameters) {
     var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
     AnnotationElement.call(this, parameters, isRenderable);
    }
    Util.inherit(UnderlineAnnotationElement, AnnotationElement, {
     render: function UnderlineAnnotationElement_render() {
      this.container.className = 'underlineAnnotation';
      if (!this.data.hasPopup) {
       this._createPopup(this.container, null, this.data);
      }
      return this.container;
     }
    });
    return UnderlineAnnotationElement;
   }();
   var SquigglyAnnotationElement = function SquigglyAnnotationElementClosure() {
    function SquigglyAnnotationElement(parameters) {
     var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
     AnnotationElement.call(this, parameters, isRenderable);
    }
    Util.inherit(SquigglyAnnotationElement, AnnotationElement, {
     render: function SquigglyAnnotationElement_render() {
      this.container.className = 'squigglyAnnotation';
      if (!this.data.hasPopup) {
       this._createPopup(this.container, null, this.data);
      }
      return this.container;
     }
    });
    return SquigglyAnnotationElement;
   }();
   var StrikeOutAnnotationElement = function StrikeOutAnnotationElementClosure() {
    function StrikeOutAnnotationElement(parameters) {
     var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
     AnnotationElement.call(this, parameters, isRenderable);
    }
    Util.inherit(StrikeOutAnnotationElement, AnnotationElement, {
     render: function StrikeOutAnnotationElement_render() {
      this.container.className = 'strikeoutAnnotation';
      if (!this.data.hasPopup) {
       this._createPopup(this.container, null, this.data);
      }
      return this.container;
     }
    });
    return StrikeOutAnnotationElement;
   }();
   var FileAttachmentAnnotationElement = function FileAttachmentAnnotationElementClosure() {
    function FileAttachmentAnnotationElement(parameters) {
     AnnotationElement.call(this, parameters, true);
     this.filename = getFilenameFromUrl(parameters.data.file.filename);
     this.content = parameters.data.file.content;
    }
    Util.inherit(FileAttachmentAnnotationElement, AnnotationElement, {
     render: function FileAttachmentAnnotationElement_render() {
      this.container.className = 'fileAttachmentAnnotation';
      var trigger = document.createElement('div');
      trigger.style.height = this.container.style.height;
      trigger.style.width = this.container.style.width;
      trigger.addEventListener('dblclick', this._download.bind(this));
      if (!this.data.hasPopup && (this.data.title || this.data.contents)) {
       this._createPopup(this.container, trigger, this.data);
      }
      this.container.appendChild(trigger);
      return this.container;
     },
     _download: function FileAttachmentAnnotationElement_download() {
      if (!this.downloadManager) {
       warn('Download cannot be started due to unavailable download manager');
       return;
      }
      this.downloadManager.downloadData(this.content, this.filename, '');
     }
    });
    return FileAttachmentAnnotationElement;
   }();
   var AnnotationLayer = function AnnotationLayerClosure() {
    return {
     render: function AnnotationLayer_render(parameters) {
      var annotationElementFactory = new AnnotationElementFactory();
      for (var i = 0, ii = parameters.annotations.length; i < ii; i++) {
       var data = parameters.annotations[i];
       if (!data) {
        continue;
       }
       var properties = {
        data: data,
        layer: parameters.div,
        page: parameters.page,
        viewport: parameters.viewport,
        linkService: parameters.linkService,
        downloadManager: parameters.downloadManager,
        imageResourcesPath: parameters.imageResourcesPath || getDefaultSetting('imageResourcesPath'),
        renderInteractiveForms: parameters.renderInteractiveForms || false
       };
       var element = annotationElementFactory.create(properties);
       if (element.isRenderable) {
        parameters.div.appendChild(element.render());
       }
      }
     },
     update: function AnnotationLayer_update(parameters) {
      for (var i = 0, ii = parameters.annotations.length; i < ii; i++) {
       var data = parameters.annotations[i];
       var element = parameters.div.querySelector('[data-annotation-id="' + data.id + '"]');
       if (element) {
        CustomStyle.setProp('transform', element, 'matrix(' + parameters.viewport.transform.join(',') + ')');
       }
      }
      parameters.div.removeAttribute('hidden');
     }
    };
   }();
   exports.AnnotationLayer = AnnotationLayer;
  }));
  (function (root, factory) {
   factory(root.pdfjsDisplayTextLayer = {}, root.pdfjsSharedUtil, root.pdfjsDisplayDOMUtils);
  }(this, function (exports, sharedUtil, displayDOMUtils) {
   var Util = sharedUtil.Util;
   var createPromiseCapability = sharedUtil.createPromiseCapability;
   var CustomStyle = displayDOMUtils.CustomStyle;
   var getDefaultSetting = displayDOMUtils.getDefaultSetting;
   var renderTextLayer = function renderTextLayerClosure() {
    var MAX_TEXT_DIVS_TO_RENDER = 100000;
    var NonWhitespaceRegexp = /\S/;
    function isAllWhitespace(str) {
     return !NonWhitespaceRegexp.test(str);
    }
    var styleBuf = [
     'left: ',
     0,
     'px; top: ',
     0,
     'px; font-size: ',
     0,
     'px; font-family: ',
     '',
     ';'
    ];
    function appendText(task, geom, styles) {
     var textDiv = document.createElement('div');
     var textDivProperties = {
      style: null,
      angle: 0,
      canvasWidth: 0,
      isWhitespace: false,
      originalTransform: null,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      scale: 1
     };
     task._textDivs.push(textDiv);
     if (isAllWhitespace(geom.str)) {
      textDivProperties.isWhitespace = true;
      task._textDivProperties.set(textDiv, textDivProperties);
      return;
     }
     var tx = Util.transform(task._viewport.transform, geom.transform);
     var angle = Math.atan2(tx[1], tx[0]);
     var style = styles[geom.fontName];
     if (style.vertical) {
      angle += Math.PI / 2;
     }
     var fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
     var fontAscent = fontHeight;
     if (style.ascent) {
      fontAscent = style.ascent * fontAscent;
     } else if (style.descent) {
      fontAscent = (1 + style.descent) * fontAscent;
     }
     var left;
     var top;
     if (angle === 0) {
      left = tx[4];
      top = tx[5] - fontAscent;
     } else {
      left = tx[4] + fontAscent * Math.sin(angle);
      top = tx[5] - fontAscent * Math.cos(angle);
     }
     styleBuf[1] = left;
     styleBuf[3] = top;
     styleBuf[5] = fontHeight;
     styleBuf[7] = style.fontFamily;
     textDivProperties.style = styleBuf.join('');
     textDiv.setAttribute('style', textDivProperties.style);
     textDiv.textContent = geom.str;
     if (getDefaultSetting('pdfBug')) {
      textDiv.dataset.fontName = geom.fontName;
     }
     if (angle !== 0) {
      textDivProperties.angle = angle * (180 / Math.PI);
     }
     if (geom.str.length > 1) {
      if (style.vertical) {
       textDivProperties.canvasWidth = geom.height * task._viewport.scale;
      } else {
       textDivProperties.canvasWidth = geom.width * task._viewport.scale;
      }
     }
     task._textDivProperties.set(textDiv, textDivProperties);
     if (task._enhanceTextSelection) {
      var angleCos = 1, angleSin = 0;
      if (angle !== 0) {
       angleCos = Math.cos(angle);
       angleSin = Math.sin(angle);
      }
      var divWidth = (style.vertical ? geom.height : geom.width) * task._viewport.scale;
      var divHeight = fontHeight;
      var m, b;
      if (angle !== 0) {
       m = [
        angleCos,
        angleSin,
        -angleSin,
        angleCos,
        left,
        top
       ];
       b = Util.getAxialAlignedBoundingBox([
        0,
        0,
        divWidth,
        divHeight
       ], m);
      } else {
       b = [
        left,
        top,
        left + divWidth,
        top + divHeight
       ];
      }
      task._bounds.push({
       left: b[0],
       top: b[1],
       right: b[2],
       bottom: b[3],
       div: textDiv,
       size: [
        divWidth,
        divHeight
       ],
       m: m
      });
     }
    }
    function render(task) {
     if (task._canceled) {
      return;
     }
     var textLayerFrag = task._container;
     var textDivs = task._textDivs;
     var capability = task._capability;
     var textDivsLength = textDivs.length;
     if (textDivsLength > MAX_TEXT_DIVS_TO_RENDER) {
      task._renderingDone = true;
      capability.resolve();
      return;
     }
     var canvas = document.createElement('canvas');
     canvas.mozOpaque = true;
     var ctx = canvas.getContext('2d', { alpha: false });
     var lastFontSize;
     var lastFontFamily;
     for (var i = 0; i < textDivsLength; i++) {
      var textDiv = textDivs[i];
      var textDivProperties = task._textDivProperties.get(textDiv);
      if (textDivProperties.isWhitespace) {
       continue;
      }
      var fontSize = textDiv.style.fontSize;
      var fontFamily = textDiv.style.fontFamily;
      if (fontSize !== lastFontSize || fontFamily !== lastFontFamily) {
       ctx.font = fontSize + ' ' + fontFamily;
       lastFontSize = fontSize;
       lastFontFamily = fontFamily;
      }
      var width = ctx.measureText(textDiv.textContent).width;
      textLayerFrag.appendChild(textDiv);
      var transform = '';
      if (textDivProperties.canvasWidth !== 0 && width > 0) {
       textDivProperties.scale = textDivProperties.canvasWidth / width;
       transform = 'scaleX(' + textDivProperties.scale + ')';
      }
      if (textDivProperties.angle !== 0) {
       transform = 'rotate(' + textDivProperties.angle + 'deg) ' + transform;
      }
      if (transform !== '') {
       textDivProperties.originalTransform = transform;
       CustomStyle.setProp('transform', textDiv, transform);
      }
      task._textDivProperties.set(textDiv, textDivProperties);
     }
     task._renderingDone = true;
     capability.resolve();
    }
    function expand(task) {
     var bounds = task._bounds;
     var viewport = task._viewport;
     var expanded = expandBounds(viewport.width, viewport.height, bounds);
     for (var i = 0; i < expanded.length; i++) {
      var div = bounds[i].div;
      var divProperties = task._textDivProperties.get(div);
      if (divProperties.angle === 0) {
       divProperties.paddingLeft = bounds[i].left - expanded[i].left;
       divProperties.paddingTop = bounds[i].top - expanded[i].top;
       divProperties.paddingRight = expanded[i].right - bounds[i].right;
       divProperties.paddingBottom = expanded[i].bottom - bounds[i].bottom;
       task._textDivProperties.set(div, divProperties);
       continue;
      }
      var e = expanded[i], b = bounds[i];
      var m = b.m, c = m[0], s = m[1];
      var points = [
       [
        0,
        0
       ],
       [
        0,
        b.size[1]
       ],
       [
        b.size[0],
        0
       ],
       b.size
      ];
      var ts = new Float64Array(64);
      points.forEach(function (p, i) {
       var t = Util.applyTransform(p, m);
       ts[i + 0] = c && (e.left - t[0]) / c;
       ts[i + 4] = s && (e.top - t[1]) / s;
       ts[i + 8] = c && (e.right - t[0]) / c;
       ts[i + 12] = s && (e.bottom - t[1]) / s;
       ts[i + 16] = s && (e.left - t[0]) / -s;
       ts[i + 20] = c && (e.top - t[1]) / c;
       ts[i + 24] = s && (e.right - t[0]) / -s;
       ts[i + 28] = c && (e.bottom - t[1]) / c;
       ts[i + 32] = c && (e.left - t[0]) / -c;
       ts[i + 36] = s && (e.top - t[1]) / -s;
       ts[i + 40] = c && (e.right - t[0]) / -c;
       ts[i + 44] = s && (e.bottom - t[1]) / -s;
       ts[i + 48] = s && (e.left - t[0]) / s;
       ts[i + 52] = c && (e.top - t[1]) / -c;
       ts[i + 56] = s && (e.right - t[0]) / s;
       ts[i + 60] = c && (e.bottom - t[1]) / -c;
      });
      var findPositiveMin = function (ts, offset, count) {
       var result = 0;
       for (var i = 0; i < count; i++) {
        var t = ts[offset++];
        if (t > 0) {
         result = result ? Math.min(t, result) : t;
        }
       }
       return result;
      };
      var boxScale = 1 + Math.min(Math.abs(c), Math.abs(s));
      divProperties.paddingLeft = findPositiveMin(ts, 32, 16) / boxScale;
      divProperties.paddingTop = findPositiveMin(ts, 48, 16) / boxScale;
      divProperties.paddingRight = findPositiveMin(ts, 0, 16) / boxScale;
      divProperties.paddingBottom = findPositiveMin(ts, 16, 16) / boxScale;
      task._textDivProperties.set(div, divProperties);
     }
    }
    function expandBounds(width, height, boxes) {
     var bounds = boxes.map(function (box, i) {
      return {
       x1: box.left,
       y1: box.top,
       x2: box.right,
       y2: box.bottom,
       index: i,
       x1New: undefined,
       x2New: undefined
      };
     });
     expandBoundsLTR(width, bounds);
     var expanded = new Array(boxes.length);
     bounds.forEach(function (b) {
      var i = b.index;
      expanded[i] = {
       left: b.x1New,
       top: 0,
       right: b.x2New,
       bottom: 0
      };
     });
     boxes.map(function (box, i) {
      var e = expanded[i], b = bounds[i];
      b.x1 = box.top;
      b.y1 = width - e.right;
      b.x2 = box.bottom;
      b.y2 = width - e.left;
      b.index = i;
      b.x1New = undefined;
      b.x2New = undefined;
     });
     expandBoundsLTR(height, bounds);
     bounds.forEach(function (b) {
      var i = b.index;
      expanded[i].top = b.x1New;
      expanded[i].bottom = b.x2New;
     });
     return expanded;
    }
    function expandBoundsLTR(width, bounds) {
     bounds.sort(function (a, b) {
      return a.x1 - b.x1 || a.index - b.index;
     });
     var fakeBoundary = {
      x1: -Infinity,
      y1: -Infinity,
      x2: 0,
      y2: Infinity,
      index: -1,
      x1New: 0,
      x2New: 0
     };
     var horizon = [{
       start: -Infinity,
       end: Infinity,
       boundary: fakeBoundary
      }];
     bounds.forEach(function (boundary) {
      var i = 0;
      while (i < horizon.length && horizon[i].end <= boundary.y1) {
       i++;
      }
      var j = horizon.length - 1;
      while (j >= 0 && horizon[j].start >= boundary.y2) {
       j--;
      }
      var horizonPart, affectedBoundary;
      var q, k, maxXNew = -Infinity;
      for (q = i; q <= j; q++) {
       horizonPart = horizon[q];
       affectedBoundary = horizonPart.boundary;
       var xNew;
       if (affectedBoundary.x2 > boundary.x1) {
        xNew = affectedBoundary.index > boundary.index ? affectedBoundary.x1New : boundary.x1;
       } else if (affectedBoundary.x2New === undefined) {
        xNew = (affectedBoundary.x2 + boundary.x1) / 2;
       } else {
        xNew = affectedBoundary.x2New;
       }
       if (xNew > maxXNew) {
        maxXNew = xNew;
       }
      }
      boundary.x1New = maxXNew;
      for (q = i; q <= j; q++) {
       horizonPart = horizon[q];
       affectedBoundary = horizonPart.boundary;
       if (affectedBoundary.x2New === undefined) {
        if (affectedBoundary.x2 > boundary.x1) {
         if (affectedBoundary.index > boundary.index) {
          affectedBoundary.x2New = affectedBoundary.x2;
         }
        } else {
         affectedBoundary.x2New = maxXNew;
        }
       } else if (affectedBoundary.x2New > maxXNew) {
        affectedBoundary.x2New = Math.max(maxXNew, affectedBoundary.x2);
       }
      }
      var changedHorizon = [], lastBoundary = null;
      for (q = i; q <= j; q++) {
       horizonPart = horizon[q];
       affectedBoundary = horizonPart.boundary;
       var useBoundary = affectedBoundary.x2 > boundary.x2 ? affectedBoundary : boundary;
       if (lastBoundary === useBoundary) {
        changedHorizon[changedHorizon.length - 1].end = horizonPart.end;
       } else {
        changedHorizon.push({
         start: horizonPart.start,
         end: horizonPart.end,
         boundary: useBoundary
        });
        lastBoundary = useBoundary;
       }
      }
      if (horizon[i].start < boundary.y1) {
       changedHorizon[0].start = boundary.y1;
       changedHorizon.unshift({
        start: horizon[i].start,
        end: boundary.y1,
        boundary: horizon[i].boundary
       });
      }
      if (boundary.y2 < horizon[j].end) {
       changedHorizon[changedHorizon.length - 1].end = boundary.y2;
       changedHorizon.push({
        start: boundary.y2,
        end: horizon[j].end,
        boundary: horizon[j].boundary
       });
      }
      for (q = i; q <= j; q++) {
       horizonPart = horizon[q];
       affectedBoundary = horizonPart.boundary;
       if (affectedBoundary.x2New !== undefined) {
        continue;
       }
       var used = false;
       for (k = i - 1; !used && k >= 0 && horizon[k].start >= affectedBoundary.y1; k--) {
        used = horizon[k].boundary === affectedBoundary;
       }
       for (k = j + 1; !used && k < horizon.length && horizon[k].end <= affectedBoundary.y2; k++) {
        used = horizon[k].boundary === affectedBoundary;
       }
       for (k = 0; !used && k < changedHorizon.length; k++) {
        used = changedHorizon[k].boundary === affectedBoundary;
       }
       if (!used) {
        affectedBoundary.x2New = maxXNew;
       }
      }
      Array.prototype.splice.apply(horizon, [
       i,
       j - i + 1
      ].concat(changedHorizon));
     });
     horizon.forEach(function (horizonPart) {
      var affectedBoundary = horizonPart.boundary;
      if (affectedBoundary.x2New === undefined) {
       affectedBoundary.x2New = Math.max(width, affectedBoundary.x2);
      }
     });
    }
    function TextLayerRenderTask(textContent, container, viewport, textDivs, enhanceTextSelection) {
     this._textContent = textContent;
     this._container = container;
     this._viewport = viewport;
     this._textDivs = textDivs || [];
     this._textDivProperties = new WeakMap();
     this._renderingDone = false;
     this._canceled = false;
     this._capability = createPromiseCapability();
     this._renderTimer = null;
     this._bounds = [];
     this._enhanceTextSelection = !!enhanceTextSelection;
    }
    TextLayerRenderTask.prototype = {
     get promise() {
      return this._capability.promise;
     },
     cancel: function TextLayer_cancel() {
      this._canceled = true;
      if (this._renderTimer !== null) {
       clearTimeout(this._renderTimer);
       this._renderTimer = null;
      }
      this._capability.reject('canceled');
     },
     _render: function TextLayer_render(timeout) {
      var textItems = this._textContent.items;
      var textStyles = this._textContent.styles;
      for (var i = 0, len = textItems.length; i < len; i++) {
       appendText(this, textItems[i], textStyles);
      }
      if (!timeout) {
       render(this);
      } else {
       var self = this;
       this._renderTimer = setTimeout(function () {
        render(self);
        self._renderTimer = null;
       }, timeout);
      }
     },
     expandTextDivs: function TextLayer_expandTextDivs(expandDivs) {
      if (!this._enhanceTextSelection || !this._renderingDone) {
       return;
      }
      if (this._bounds !== null) {
       expand(this);
       this._bounds = null;
      }
      for (var i = 0, ii = this._textDivs.length; i < ii; i++) {
       var div = this._textDivs[i];
       var divProperties = this._textDivProperties.get(div);
       if (divProperties.isWhitespace) {
        continue;
       }
       if (expandDivs) {
        var transform = '', padding = '';
        if (divProperties.scale !== 1) {
         transform = 'scaleX(' + divProperties.scale + ')';
        }
        if (divProperties.angle !== 0) {
         transform = 'rotate(' + divProperties.angle + 'deg) ' + transform;
        }
        if (divProperties.paddingLeft !== 0) {
         padding += ' padding-left: ' + divProperties.paddingLeft / divProperties.scale + 'px;';
         transform += ' translateX(' + -divProperties.paddingLeft / divProperties.scale + 'px)';
        }
        if (divProperties.paddingTop !== 0) {
         padding += ' padding-top: ' + divProperties.paddingTop + 'px;';
         transform += ' translateY(' + -divProperties.paddingTop + 'px)';
        }
        if (divProperties.paddingRight !== 0) {
         padding += ' padding-right: ' + divProperties.paddingRight / divProperties.scale + 'px;';
        }
        if (divProperties.paddingBottom !== 0) {
         padding += ' padding-bottom: ' + divProperties.paddingBottom + 'px;';
        }
        if (padding !== '') {
         div.setAttribute('style', divProperties.style + padding);
        }
        if (transform !== '') {
         CustomStyle.setProp('transform', div, transform);
        }
       } else {
        div.style.padding = 0;
        CustomStyle.setProp('transform', div, divProperties.originalTransform || '');
       }
      }
     }
    };
    function renderTextLayer(renderParameters) {
     var task = new TextLayerRenderTask(renderParameters.textContent, renderParameters.container, renderParameters.viewport, renderParameters.textDivs, renderParameters.enhanceTextSelection);
     task._render(renderParameters.timeout);
     return task;
    }
    return renderTextLayer;
   }();
   exports.renderTextLayer = renderTextLayer;
  }));
  (function (root, factory) {
   factory(root.pdfjsDisplayWebGL = {}, root.pdfjsSharedUtil, root.pdfjsDisplayDOMUtils);
  }(this, function (exports, sharedUtil, displayDOMUtils) {
   var shadow = sharedUtil.shadow;
   var getDefaultSetting = displayDOMUtils.getDefaultSetting;
   var WebGLUtils = function WebGLUtilsClosure() {
    function loadShader(gl, code, shaderType) {
     var shader = gl.createShader(shaderType);
     gl.shaderSource(shader, code);
     gl.compileShader(shader);
     var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
     if (!compiled) {
      var errorMsg = gl.getShaderInfoLog(shader);
      throw new Error('Error during shader compilation: ' + errorMsg);
     }
     return shader;
    }
    function createVertexShader(gl, code) {
     return loadShader(gl, code, gl.VERTEX_SHADER);
    }
    function createFragmentShader(gl, code) {
     return loadShader(gl, code, gl.FRAGMENT_SHADER);
    }
    function createProgram(gl, shaders) {
     var program = gl.createProgram();
     for (var i = 0, ii = shaders.length; i < ii; ++i) {
      gl.attachShader(program, shaders[i]);
     }
     gl.linkProgram(program);
     var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
     if (!linked) {
      var errorMsg = gl.getProgramInfoLog(program);
      throw new Error('Error during program linking: ' + errorMsg);
     }
     return program;
    }
    function createTexture(gl, image, textureId) {
     gl.activeTexture(textureId);
     var texture = gl.createTexture();
     gl.bindTexture(gl.TEXTURE_2D, texture);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
     return texture;
    }
    var currentGL, currentCanvas;
    function generateGL() {
     if (currentGL) {
      return;
     }
     currentCanvas = document.createElement('canvas');
     currentGL = currentCanvas.getContext('webgl', { premultipliedalpha: false });
    }
    var smaskVertexShaderCode = '\
  attribute vec2 a_position;                                    \
  attribute vec2 a_texCoord;                                    \
                                                                \
  uniform vec2 u_resolution;                                    \
                                                                \
  varying vec2 v_texCoord;                                      \
                                                                \
  void main() {                                                 \
    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;   \
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);          \
                                                                \
    v_texCoord = a_texCoord;                                    \
  }                                                             ';
    var smaskFragmentShaderCode = '\
  precision mediump float;                                      \
                                                                \
  uniform vec4 u_backdrop;                                      \
  uniform int u_subtype;                                        \
  uniform sampler2D u_image;                                    \
  uniform sampler2D u_mask;                                     \
                                                                \
  varying vec2 v_texCoord;                                      \
                                                                \
  void main() {                                                 \
    vec4 imageColor = texture2D(u_image, v_texCoord);           \
    vec4 maskColor = texture2D(u_mask, v_texCoord);             \
    if (u_backdrop.a > 0.0) {                                   \
      maskColor.rgb = maskColor.rgb * maskColor.a +             \
                      u_backdrop.rgb * (1.0 - maskColor.a);     \
    }                                                           \
    float lum;                                                  \
    if (u_subtype == 0) {                                       \
      lum = maskColor.a;                                        \
    } else {                                                    \
      lum = maskColor.r * 0.3 + maskColor.g * 0.59 +            \
            maskColor.b * 0.11;                                 \
    }                                                           \
    imageColor.a *= lum;                                        \
    imageColor.rgb *= imageColor.a;                             \
    gl_FragColor = imageColor;                                  \
  }                                                             ';
    var smaskCache = null;
    function initSmaskGL() {
     var canvas, gl;
     generateGL();
     canvas = currentCanvas;
     currentCanvas = null;
     gl = currentGL;
     currentGL = null;
     var vertexShader = createVertexShader(gl, smaskVertexShaderCode);
     var fragmentShader = createFragmentShader(gl, smaskFragmentShaderCode);
     var program = createProgram(gl, [
      vertexShader,
      fragmentShader
     ]);
     gl.useProgram(program);
     var cache = {};
     cache.gl = gl;
     cache.canvas = canvas;
     cache.resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
     cache.positionLocation = gl.getAttribLocation(program, 'a_position');
     cache.backdropLocation = gl.getUniformLocation(program, 'u_backdrop');
     cache.subtypeLocation = gl.getUniformLocation(program, 'u_subtype');
     var texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
     var texLayerLocation = gl.getUniformLocation(program, 'u_image');
     var texMaskLocation = gl.getUniformLocation(program, 'u_mask');
     var texCoordBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0,
      1.0
     ]), gl.STATIC_DRAW);
     gl.enableVertexAttribArray(texCoordLocation);
     gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
     gl.uniform1i(texLayerLocation, 0);
     gl.uniform1i(texMaskLocation, 1);
     smaskCache = cache;
    }
    function composeSMask(layer, mask, properties) {
     var width = layer.width, height = layer.height;
     if (!smaskCache) {
      initSmaskGL();
     }
     var cache = smaskCache, canvas = cache.canvas, gl = cache.gl;
     canvas.width = width;
     canvas.height = height;
     gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
     gl.uniform2f(cache.resolutionLocation, width, height);
     if (properties.backdrop) {
      gl.uniform4f(cache.resolutionLocation, properties.backdrop[0], properties.backdrop[1], properties.backdrop[2], 1);
     } else {
      gl.uniform4f(cache.resolutionLocation, 0, 0, 0, 0);
     }
     gl.uniform1i(cache.subtypeLocation, properties.subtype === 'Luminosity' ? 1 : 0);
     var texture = createTexture(gl, layer, gl.TEXTURE0);
     var maskTexture = createTexture(gl, mask, gl.TEXTURE1);
     var buffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0,
      0,
      width,
      0,
      0,
      height,
      0,
      height,
      width,
      0,
      width,
      height
     ]), gl.STATIC_DRAW);
     gl.enableVertexAttribArray(cache.positionLocation);
     gl.vertexAttribPointer(cache.positionLocation, 2, gl.FLOAT, false, 0, 0);
     gl.clearColor(0, 0, 0, 0);
     gl.enable(gl.BLEND);
     gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
     gl.clear(gl.COLOR_BUFFER_BIT);
     gl.drawArrays(gl.TRIANGLES, 0, 6);
     gl.flush();
     gl.deleteTexture(texture);
     gl.deleteTexture(maskTexture);
     gl.deleteBuffer(buffer);
     return canvas;
    }
    var figuresVertexShaderCode = '\
  attribute vec2 a_position;                                    \
  attribute vec3 a_color;                                       \
                                                                \
  uniform vec2 u_resolution;                                    \
  uniform vec2 u_scale;                                         \
  uniform vec2 u_offset;                                        \
                                                                \
  varying vec4 v_color;                                         \
                                                                \
  void main() {                                                 \
    vec2 position = (a_position + u_offset) * u_scale;          \
    vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;     \
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);          \
                                                                \
    v_color = vec4(a_color / 255.0, 1.0);                       \
  }                                                             ';
    var figuresFragmentShaderCode = '\
  precision mediump float;                                      \
                                                                \
  varying vec4 v_color;                                         \
                                                                \
  void main() {                                                 \
    gl_FragColor = v_color;                                     \
  }                                                             ';
    var figuresCache = null;
    function initFiguresGL() {
     var canvas, gl;
     generateGL();
     canvas = currentCanvas;
     currentCanvas = null;
     gl = currentGL;
     currentGL = null;
     var vertexShader = createVertexShader(gl, figuresVertexShaderCode);
     var fragmentShader = createFragmentShader(gl, figuresFragmentShaderCode);
     var program = createProgram(gl, [
      vertexShader,
      fragmentShader
     ]);
     gl.useProgram(program);
     var cache = {};
     cache.gl = gl;
     cache.canvas = canvas;
     cache.resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
     cache.scaleLocation = gl.getUniformLocation(program, 'u_scale');
     cache.offsetLocation = gl.getUniformLocation(program, 'u_offset');
     cache.positionLocation = gl.getAttribLocation(program, 'a_position');
     cache.colorLocation = gl.getAttribLocation(program, 'a_color');
     figuresCache = cache;
    }
    function drawFigures(width, height, backgroundColor, figures, context) {
     if (!figuresCache) {
      initFiguresGL();
     }
     var cache = figuresCache, canvas = cache.canvas, gl = cache.gl;
     canvas.width = width;
     canvas.height = height;
     gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
     gl.uniform2f(cache.resolutionLocation, width, height);
     var count = 0;
     var i, ii, rows;
     for (i = 0, ii = figures.length; i < ii; i++) {
      switch (figures[i].type) {
      case 'lattice':
       rows = figures[i].coords.length / figures[i].verticesPerRow | 0;
       count += (rows - 1) * (figures[i].verticesPerRow - 1) * 6;
       break;
      case 'triangles':
       count += figures[i].coords.length;
       break;
      }
     }
     var coords = new Float32Array(count * 2);
     var colors = new Uint8Array(count * 3);
     var coordsMap = context.coords, colorsMap = context.colors;
     var pIndex = 0, cIndex = 0;
     for (i = 0, ii = figures.length; i < ii; i++) {
      var figure = figures[i], ps = figure.coords, cs = figure.colors;
      switch (figure.type) {
      case 'lattice':
       var cols = figure.verticesPerRow;
       rows = ps.length / cols | 0;
       for (var row = 1; row < rows; row++) {
        var offset = row * cols + 1;
        for (var col = 1; col < cols; col++, offset++) {
         coords[pIndex] = coordsMap[ps[offset - cols - 1]];
         coords[pIndex + 1] = coordsMap[ps[offset - cols - 1] + 1];
         coords[pIndex + 2] = coordsMap[ps[offset - cols]];
         coords[pIndex + 3] = coordsMap[ps[offset - cols] + 1];
         coords[pIndex + 4] = coordsMap[ps[offset - 1]];
         coords[pIndex + 5] = coordsMap[ps[offset - 1] + 1];
         colors[cIndex] = colorsMap[cs[offset - cols - 1]];
         colors[cIndex + 1] = colorsMap[cs[offset - cols - 1] + 1];
         colors[cIndex + 2] = colorsMap[cs[offset - cols - 1] + 2];
         colors[cIndex + 3] = colorsMap[cs[offset - cols]];
         colors[cIndex + 4] = colorsMap[cs[offset - cols] + 1];
         colors[cIndex + 5] = colorsMap[cs[offset - cols] + 2];
         colors[cIndex + 6] = colorsMap[cs[offset - 1]];
         colors[cIndex + 7] = colorsMap[cs[offset - 1] + 1];
         colors[cIndex + 8] = colorsMap[cs[offset - 1] + 2];
         coords[pIndex + 6] = coords[pIndex + 2];
         coords[pIndex + 7] = coords[pIndex + 3];
         coords[pIndex + 8] = coords[pIndex + 4];
         coords[pIndex + 9] = coords[pIndex + 5];
         coords[pIndex + 10] = coordsMap[ps[offset]];
         coords[pIndex + 11] = coordsMap[ps[offset] + 1];
         colors[cIndex + 9] = colors[cIndex + 3];
         colors[cIndex + 10] = colors[cIndex + 4];
         colors[cIndex + 11] = colors[cIndex + 5];
         colors[cIndex + 12] = colors[cIndex + 6];
         colors[cIndex + 13] = colors[cIndex + 7];
         colors[cIndex + 14] = colors[cIndex + 8];
         colors[cIndex + 15] = colorsMap[cs[offset]];
         colors[cIndex + 16] = colorsMap[cs[offset] + 1];
         colors[cIndex + 17] = colorsMap[cs[offset] + 2];
         pIndex += 12;
         cIndex += 18;
        }
       }
       break;
      case 'triangles':
       for (var j = 0, jj = ps.length; j < jj; j++) {
        coords[pIndex] = coordsMap[ps[j]];
        coords[pIndex + 1] = coordsMap[ps[j] + 1];
        colors[cIndex] = colorsMap[cs[j]];
        colors[cIndex + 1] = colorsMap[cs[j] + 1];
        colors[cIndex + 2] = colorsMap[cs[j] + 2];
        pIndex += 2;
        cIndex += 3;
       }
       break;
      }
     }
     if (backgroundColor) {
      gl.clearColor(backgroundColor[0] / 255, backgroundColor[1] / 255, backgroundColor[2] / 255, 1.0);
     } else {
      gl.clearColor(0, 0, 0, 0);
     }
     gl.clear(gl.COLOR_BUFFER_BIT);
     var coordsBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, coordsBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STATIC_DRAW);
     gl.enableVertexAttribArray(cache.positionLocation);
     gl.vertexAttribPointer(cache.positionLocation, 2, gl.FLOAT, false, 0, 0);
     var colorsBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
     gl.enableVertexAttribArray(cache.colorLocation);
     gl.vertexAttribPointer(cache.colorLocation, 3, gl.UNSIGNED_BYTE, false, 0, 0);
     gl.uniform2f(cache.scaleLocation, context.scaleX, context.scaleY);
     gl.uniform2f(cache.offsetLocation, context.offsetX, context.offsetY);
     gl.drawArrays(gl.TRIANGLES, 0, count);
     gl.flush();
     gl.deleteBuffer(coordsBuffer);
     gl.deleteBuffer(colorsBuffer);
     return canvas;
    }
    function cleanup() {
     if (smaskCache && smaskCache.canvas) {
      smaskCache.canvas.width = 0;
      smaskCache.canvas.height = 0;
     }
     if (figuresCache && figuresCache.canvas) {
      figuresCache.canvas.width = 0;
      figuresCache.canvas.height = 0;
     }
     smaskCache = null;
     figuresCache = null;
    }
    return {
     get isEnabled() {
      if (getDefaultSetting('disableWebGL')) {
       return false;
      }
      var enabled = false;
      try {
       generateGL();
       enabled = !!currentGL;
      } catch (e) {
      }
      return shadow(this, 'isEnabled', enabled);
     },
     composeSMask: composeSMask,
     drawFigures: drawFigures,
     clear: cleanup
    };
   }();
   exports.WebGLUtils = WebGLUtils;
  }));
  (function (root, factory) {
   factory(root.pdfjsDisplayPatternHelper = {}, root.pdfjsSharedUtil, root.pdfjsDisplayWebGL);
  }(this, function (exports, sharedUtil, displayWebGL) {
   var Util = sharedUtil.Util;
   var info = sharedUtil.info;
   var isArray = sharedUtil.isArray;
   var error = sharedUtil.error;
   var WebGLUtils = displayWebGL.WebGLUtils;
   var ShadingIRs = {};
   ShadingIRs.RadialAxial = {
    fromIR: function RadialAxial_fromIR(raw) {
     var type = raw[1];
     var colorStops = raw[2];
     var p0 = raw[3];
     var p1 = raw[4];
     var r0 = raw[5];
     var r1 = raw[6];
     return {
      type: 'Pattern',
      getPattern: function RadialAxial_getPattern(ctx) {
       var grad;
       if (type === 'axial') {
        grad = ctx.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
       } else if (type === 'radial') {
        grad = ctx.createRadialGradient(p0[0], p0[1], r0, p1[0], p1[1], r1);
       }
       for (var i = 0, ii = colorStops.length; i < ii; ++i) {
        var c = colorStops[i];
        grad.addColorStop(c[0], c[1]);
       }
       return grad;
      }
     };
    }
   };
   var createMeshCanvas = function createMeshCanvasClosure() {
    function drawTriangle(data, context, p1, p2, p3, c1, c2, c3) {
     var coords = context.coords, colors = context.colors;
     var bytes = data.data, rowSize = data.width * 4;
     var tmp;
     if (coords[p1 + 1] > coords[p2 + 1]) {
      tmp = p1;
      p1 = p2;
      p2 = tmp;
      tmp = c1;
      c1 = c2;
      c2 = tmp;
     }
     if (coords[p2 + 1] > coords[p3 + 1]) {
      tmp = p2;
      p2 = p3;
      p3 = tmp;
      tmp = c2;
      c2 = c3;
      c3 = tmp;
     }
     if (coords[p1 + 1] > coords[p2 + 1]) {
      tmp = p1;
      p1 = p2;
      p2 = tmp;
      tmp = c1;
      c1 = c2;
      c2 = tmp;
     }
     var x1 = (coords[p1] + context.offsetX) * context.scaleX;
     var y1 = (coords[p1 + 1] + context.offsetY) * context.scaleY;
     var x2 = (coords[p2] + context.offsetX) * context.scaleX;
     var y2 = (coords[p2 + 1] + context.offsetY) * context.scaleY;
     var x3 = (coords[p3] + context.offsetX) * context.scaleX;
     var y3 = (coords[p3 + 1] + context.offsetY) * context.scaleY;
     if (y1 >= y3) {
      return;
     }
     var c1r = colors[c1], c1g = colors[c1 + 1], c1b = colors[c1 + 2];
     var c2r = colors[c2], c2g = colors[c2 + 1], c2b = colors[c2 + 2];
     var c3r = colors[c3], c3g = colors[c3 + 1], c3b = colors[c3 + 2];
     var minY = Math.round(y1), maxY = Math.round(y3);
     var xa, car, cag, cab;
     var xb, cbr, cbg, cbb;
     var k;
     for (var y = minY; y <= maxY; y++) {
      if (y < y2) {
       k = y < y1 ? 0 : y1 === y2 ? 1 : (y1 - y) / (y1 - y2);
       xa = x1 - (x1 - x2) * k;
       car = c1r - (c1r - c2r) * k;
       cag = c1g - (c1g - c2g) * k;
       cab = c1b - (c1b - c2b) * k;
      } else {
       k = y > y3 ? 1 : y2 === y3 ? 0 : (y2 - y) / (y2 - y3);
       xa = x2 - (x2 - x3) * k;
       car = c2r - (c2r - c3r) * k;
       cag = c2g - (c2g - c3g) * k;
       cab = c2b - (c2b - c3b) * k;
      }
      k = y < y1 ? 0 : y > y3 ? 1 : (y1 - y) / (y1 - y3);
      xb = x1 - (x1 - x3) * k;
      cbr = c1r - (c1r - c3r) * k;
      cbg = c1g - (c1g - c3g) * k;
      cbb = c1b - (c1b - c3b) * k;
      var x1_ = Math.round(Math.min(xa, xb));
      var x2_ = Math.round(Math.max(xa, xb));
      var j = rowSize * y + x1_ * 4;
      for (var x = x1_; x <= x2_; x++) {
       k = (xa - x) / (xa - xb);
       k = k < 0 ? 0 : k > 1 ? 1 : k;
       bytes[j++] = car - (car - cbr) * k | 0;
       bytes[j++] = cag - (cag - cbg) * k | 0;
       bytes[j++] = cab - (cab - cbb) * k | 0;
       bytes[j++] = 255;
      }
     }
    }
    function drawFigure(data, figure, context) {
     var ps = figure.coords;
     var cs = figure.colors;
     var i, ii;
     switch (figure.type) {
     case 'lattice':
      var verticesPerRow = figure.verticesPerRow;
      var rows = Math.floor(ps.length / verticesPerRow) - 1;
      var cols = verticesPerRow - 1;
      for (i = 0; i < rows; i++) {
       var q = i * verticesPerRow;
       for (var j = 0; j < cols; j++, q++) {
        drawTriangle(data, context, ps[q], ps[q + 1], ps[q + verticesPerRow], cs[q], cs[q + 1], cs[q + verticesPerRow]);
        drawTriangle(data, context, ps[q + verticesPerRow + 1], ps[q + 1], ps[q + verticesPerRow], cs[q + verticesPerRow + 1], cs[q + 1], cs[q + verticesPerRow]);
       }
      }
      break;
     case 'triangles':
      for (i = 0, ii = ps.length; i < ii; i += 3) {
       drawTriangle(data, context, ps[i], ps[i + 1], ps[i + 2], cs[i], cs[i + 1], cs[i + 2]);
      }
      break;
     default:
      error('illigal figure');
      break;
     }
    }
    function createMeshCanvas(bounds, combinesScale, coords, colors, figures, backgroundColor, cachedCanvases) {
     var EXPECTED_SCALE = 1.1;
     var MAX_PATTERN_SIZE = 3000;
     var BORDER_SIZE = 2;
     var offsetX = Math.floor(bounds[0]);
     var offsetY = Math.floor(bounds[1]);
     var boundsWidth = Math.ceil(bounds[2]) - offsetX;
     var boundsHeight = Math.ceil(bounds[3]) - offsetY;
     var width = Math.min(Math.ceil(Math.abs(boundsWidth * combinesScale[0] * EXPECTED_SCALE)), MAX_PATTERN_SIZE);
     var height = Math.min(Math.ceil(Math.abs(boundsHeight * combinesScale[1] * EXPECTED_SCALE)), MAX_PATTERN_SIZE);
     var scaleX = boundsWidth / width;
     var scaleY = boundsHeight / height;
     var context = {
      coords: coords,
      colors: colors,
      offsetX: -offsetX,
      offsetY: -offsetY,
      scaleX: 1 / scaleX,
      scaleY: 1 / scaleY
     };
     var paddedWidth = width + BORDER_SIZE * 2;
     var paddedHeight = height + BORDER_SIZE * 2;
     var canvas, tmpCanvas, i, ii;
     if (WebGLUtils.isEnabled) {
      canvas = WebGLUtils.drawFigures(width, height, backgroundColor, figures, context);
      tmpCanvas = cachedCanvases.getCanvas('mesh', paddedWidth, paddedHeight, false);
      tmpCanvas.context.drawImage(canvas, BORDER_SIZE, BORDER_SIZE);
      canvas = tmpCanvas.canvas;
     } else {
      tmpCanvas = cachedCanvases.getCanvas('mesh', paddedWidth, paddedHeight, false);
      var tmpCtx = tmpCanvas.context;
      var data = tmpCtx.createImageData(width, height);
      if (backgroundColor) {
       var bytes = data.data;
       for (i = 0, ii = bytes.length; i < ii; i += 4) {
        bytes[i] = backgroundColor[0];
        bytes[i + 1] = backgroundColor[1];
        bytes[i + 2] = backgroundColor[2];
        bytes[i + 3] = 255;
       }
      }
      for (i = 0; i < figures.length; i++) {
       drawFigure(data, figures[i], context);
      }
      tmpCtx.putImageData(data, BORDER_SIZE, BORDER_SIZE);
      canvas = tmpCanvas.canvas;
     }
     return {
      canvas: canvas,
      offsetX: offsetX - BORDER_SIZE * scaleX,
      offsetY: offsetY - BORDER_SIZE * scaleY,
      scaleX: scaleX,
      scaleY: scaleY
     };
    }
    return createMeshCanvas;
   }();
   ShadingIRs.Mesh = {
    fromIR: function Mesh_fromIR(raw) {
     var coords = raw[2];
     var colors = raw[3];
     var figures = raw[4];
     var bounds = raw[5];
     var matrix = raw[6];
     var background = raw[8];
     return {
      type: 'Pattern',
      getPattern: function Mesh_getPattern(ctx, owner, shadingFill) {
       var scale;
       if (shadingFill) {
        scale = Util.singularValueDecompose2dScale(ctx.mozCurrentTransform);
       } else {
        scale = Util.singularValueDecompose2dScale(owner.baseTransform);
        if (matrix) {
         var matrixScale = Util.singularValueDecompose2dScale(matrix);
         scale = [
          scale[0] * matrixScale[0],
          scale[1] * matrixScale[1]
         ];
        }
       }
       var temporaryPatternCanvas = createMeshCanvas(bounds, scale, coords, colors, figures, shadingFill ? null : background, owner.cachedCanvases);
       if (!shadingFill) {
        ctx.setTransform.apply(ctx, owner.baseTransform);
        if (matrix) {
         ctx.transform.apply(ctx, matrix);
        }
       }
       ctx.translate(temporaryPatternCanvas.offsetX, temporaryPatternCanvas.offsetY);
       ctx.scale(temporaryPatternCanvas.scaleX, temporaryPatternCanvas.scaleY);
       return ctx.createPattern(temporaryPatternCanvas.canvas, 'no-repeat');
      }
     };
    }
   };
   ShadingIRs.Dummy = {
    fromIR: function Dummy_fromIR() {
     return {
      type: 'Pattern',
      getPattern: function Dummy_fromIR_getPattern() {
       return 'hotpink';
      }
     };
    }
   };
   function getShadingPatternFromIR(raw) {
    var shadingIR = ShadingIRs[raw[0]];
    if (!shadingIR) {
     error('Unknown IR type: ' + raw[0]);
    }
    return shadingIR.fromIR(raw);
   }
   var TilingPattern = function TilingPatternClosure() {
    var PaintType = {
     COLORED: 1,
     UNCOLORED: 2
    };
    var MAX_PATTERN_SIZE = 3000;
    function TilingPattern(IR, color, ctx, canvasGraphicsFactory, baseTransform) {
     this.operatorList = IR[2];
     this.matrix = IR[3] || [
      1,
      0,
      0,
      1,
      0,
      0
     ];
     this.bbox = IR[4];
     this.xstep = IR[5];
     this.ystep = IR[6];
     this.paintType = IR[7];
     this.tilingType = IR[8];
     this.color = color;
     this.canvasGraphicsFactory = canvasGraphicsFactory;
     this.baseTransform = baseTransform;
     this.type = 'Pattern';
     this.ctx = ctx;
    }
    TilingPattern.prototype = {
     createPatternCanvas: function TilinPattern_createPatternCanvas(owner) {
      var operatorList = this.operatorList;
      var bbox = this.bbox;
      var xstep = this.xstep;
      var ystep = this.ystep;
      var paintType = this.paintType;
      var tilingType = this.tilingType;
      var color = this.color;
      var canvasGraphicsFactory = this.canvasGraphicsFactory;
      info('TilingType: ' + tilingType);
      var x0 = bbox[0], y0 = bbox[1], x1 = bbox[2], y1 = bbox[3];
      var topLeft = [
       x0,
       y0
      ];
      var botRight = [
       x0 + xstep,
       y0 + ystep
      ];
      var width = botRight[0] - topLeft[0];
      var height = botRight[1] - topLeft[1];
      var matrixScale = Util.singularValueDecompose2dScale(this.matrix);
      var curMatrixScale = Util.singularValueDecompose2dScale(this.baseTransform);
      var combinedScale = [
       matrixScale[0] * curMatrixScale[0],
       matrixScale[1] * curMatrixScale[1]
      ];
      width = Math.min(Math.ceil(Math.abs(width * combinedScale[0])), MAX_PATTERN_SIZE);
      height = Math.min(Math.ceil(Math.abs(height * combinedScale[1])), MAX_PATTERN_SIZE);
      var tmpCanvas = owner.cachedCanvases.getCanvas('pattern', width, height, true);
      var tmpCtx = tmpCanvas.context;
      var graphics = canvasGraphicsFactory.createCanvasGraphics(tmpCtx);
      graphics.groupLevel = owner.groupLevel;
      this.setFillAndStrokeStyleToContext(tmpCtx, paintType, color);
      this.setScale(width, height, xstep, ystep);
      this.transformToScale(graphics);
      var tmpTranslate = [
       1,
       0,
       0,
       1,
       -topLeft[0],
       -topLeft[1]
      ];
      graphics.transform.apply(graphics, tmpTranslate);
      this.clipBbox(graphics, bbox, x0, y0, x1, y1);
      graphics.executeOperatorList(operatorList);
      return tmpCanvas.canvas;
     },
     setScale: function TilingPattern_setScale(width, height, xstep, ystep) {
      this.scale = [
       width / xstep,
       height / ystep
      ];
     },
     transformToScale: function TilingPattern_transformToScale(graphics) {
      var scale = this.scale;
      var tmpScale = [
       scale[0],
       0,
       0,
       scale[1],
       0,
       0
      ];
      graphics.transform.apply(graphics, tmpScale);
     },
     scaleToContext: function TilingPattern_scaleToContext() {
      var scale = this.scale;
      this.ctx.scale(1 / scale[0], 1 / scale[1]);
     },
     clipBbox: function clipBbox(graphics, bbox, x0, y0, x1, y1) {
      if (bbox && isArray(bbox) && bbox.length === 4) {
       var bboxWidth = x1 - x0;
       var bboxHeight = y1 - y0;
       graphics.ctx.rect(x0, y0, bboxWidth, bboxHeight);
       graphics.clip();
       graphics.endPath();
      }
     },
     setFillAndStrokeStyleToContext: function setFillAndStrokeStyleToContext(context, paintType, color) {
      switch (paintType) {
      case PaintType.COLORED:
       var ctx = this.ctx;
       context.fillStyle = ctx.fillStyle;
       context.strokeStyle = ctx.strokeStyle;
       break;
      case PaintType.UNCOLORED:
       var cssColor = Util.makeCssRgb(color[0], color[1], color[2]);
       context.fillStyle = cssColor;
       context.strokeStyle = cssColor;
       break;
      default:
       error('Unsupported paint type: ' + paintType);
      }
     },
     getPattern: function TilingPattern_getPattern(ctx, owner) {
      var temporaryPatternCanvas = this.createPatternCanvas(owner);
      ctx = this.ctx;
      ctx.setTransform.apply(ctx, this.baseTransform);
      ctx.transform.apply(ctx, this.matrix);
      this.scaleToContext();
      return ctx.createPattern(temporaryPatternCanvas, 'repeat');
     }
    };
    return TilingPattern;
   }();
   exports.getShadingPatternFromIR = getShadingPatternFromIR;
   exports.TilingPattern = TilingPattern;
  }));
  (function (root, factory) {
   factory(root.pdfjsDisplayCanvas = {}, root.pdfjsSharedUtil, root.pdfjsDisplayDOMUtils, root.pdfjsDisplayPatternHelper, root.pdfjsDisplayWebGL);
  }(this, function (exports, sharedUtil, displayDOMUtils, displayPatternHelper, displayWebGL) {
   var FONT_IDENTITY_MATRIX = sharedUtil.FONT_IDENTITY_MATRIX;
   var IDENTITY_MATRIX = sharedUtil.IDENTITY_MATRIX;
   var ImageKind = sharedUtil.ImageKind;
   var OPS = sharedUtil.OPS;
   var TextRenderingMode = sharedUtil.TextRenderingMode;
   var Uint32ArrayView = sharedUtil.Uint32ArrayView;
   var Util = sharedUtil.Util;
   var assert = sharedUtil.assert;
   var info = sharedUtil.info;
   var isNum = sharedUtil.isNum;
   var isArray = sharedUtil.isArray;
   var isLittleEndian = sharedUtil.isLittleEndian;
   var error = sharedUtil.error;
   var shadow = sharedUtil.shadow;
   var warn = sharedUtil.warn;
   var TilingPattern = displayPatternHelper.TilingPattern;
   var getShadingPatternFromIR = displayPatternHelper.getShadingPatternFromIR;
   var WebGLUtils = displayWebGL.WebGLUtils;
   var hasCanvasTypedArrays = displayDOMUtils.hasCanvasTypedArrays;
   var MIN_FONT_SIZE = 16;
   var MAX_FONT_SIZE = 100;
   var MAX_GROUP_SIZE = 4096;
   var MIN_WIDTH_FACTOR = 0.65;
   var COMPILE_TYPE3_GLYPHS = true;
   var MAX_SIZE_TO_COMPILE = 1000;
   var FULL_CHUNK_HEIGHT = 16;
   var HasCanvasTypedArraysCached = {
    get value() {
     return shadow(HasCanvasTypedArraysCached, 'value', hasCanvasTypedArrays());
    }
   };
   var IsLittleEndianCached = {
    get value() {
     return shadow(IsLittleEndianCached, 'value', isLittleEndian());
    }
   };
   function createScratchCanvas(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
   }
   function addContextCurrentTransform(ctx) {
    if (!ctx.mozCurrentTransform) {
     ctx._originalSave = ctx.save;
     ctx._originalRestore = ctx.restore;
     ctx._originalRotate = ctx.rotate;
     ctx._originalScale = ctx.scale;
     ctx._originalTranslate = ctx.translate;
     ctx._originalTransform = ctx.transform;
     ctx._originalSetTransform = ctx.setTransform;
     ctx._transformMatrix = ctx._transformMatrix || [
      1,
      0,
      0,
      1,
      0,
      0
     ];
     ctx._transformStack = [];
     Object.defineProperty(ctx, 'mozCurrentTransform', {
      get: function getCurrentTransform() {
       return this._transformMatrix;
      }
     });
     Object.defineProperty(ctx, 'mozCurrentTransformInverse', {
      get: function getCurrentTransformInverse() {
       var m = this._transformMatrix;
       var a = m[0], b = m[1], c = m[2], d = m[3], e = m[4], f = m[5];
       var ad_bc = a * d - b * c;
       var bc_ad = b * c - a * d;
       return [
        d / ad_bc,
        b / bc_ad,
        c / bc_ad,
        a / ad_bc,
        (d * e - c * f) / bc_ad,
        (b * e - a * f) / ad_bc
       ];
      }
     });
     ctx.save = function ctxSave() {
      var old = this._transformMatrix;
      this._transformStack.push(old);
      this._transformMatrix = old.slice(0, 6);
      this._originalSave();
     };
     ctx.restore = function ctxRestore() {
      var prev = this._transformStack.pop();
      if (prev) {
       this._transformMatrix = prev;
       this._originalRestore();
      }
     };
     ctx.translate = function ctxTranslate(x, y) {
      var m = this._transformMatrix;
      m[4] = m[0] * x + m[2] * y + m[4];
      m[5] = m[1] * x + m[3] * y + m[5];
      this._originalTranslate(x, y);
     };
     ctx.scale = function ctxScale(x, y) {
      var m = this._transformMatrix;
      m[0] = m[0] * x;
      m[1] = m[1] * x;
      m[2] = m[2] * y;
      m[3] = m[3] * y;
      this._originalScale(x, y);
     };
     ctx.transform = function ctxTransform(a, b, c, d, e, f) {
      var m = this._transformMatrix;
      this._transformMatrix = [
       m[0] * a + m[2] * b,
       m[1] * a + m[3] * b,
       m[0] * c + m[2] * d,
       m[1] * c + m[3] * d,
       m[0] * e + m[2] * f + m[4],
       m[1] * e + m[3] * f + m[5]
      ];
      ctx._originalTransform(a, b, c, d, e, f);
     };
     ctx.setTransform = function ctxSetTransform(a, b, c, d, e, f) {
      this._transformMatrix = [
       a,
       b,
       c,
       d,
       e,
       f
      ];
      ctx._originalSetTransform(a, b, c, d, e, f);
     };
     ctx.rotate = function ctxRotate(angle) {
      var cosValue = Math.cos(angle);
      var sinValue = Math.sin(angle);
      var m = this._transformMatrix;
      this._transformMatrix = [
       m[0] * cosValue + m[2] * sinValue,
       m[1] * cosValue + m[3] * sinValue,
       m[0] * -sinValue + m[2] * cosValue,
       m[1] * -sinValue + m[3] * cosValue,
       m[4],
       m[5]
      ];
      this._originalRotate(angle);
     };
    }
   }
   var CachedCanvases = function CachedCanvasesClosure() {
    function CachedCanvases() {
     this.cache = Object.create(null);
    }
    CachedCanvases.prototype = {
     getCanvas: function CachedCanvases_getCanvas(id, width, height, trackTransform) {
      var canvasEntry;
      if (this.cache[id] !== undefined) {
       canvasEntry = this.cache[id];
       canvasEntry.canvas.width = width;
       canvasEntry.canvas.height = height;
       canvasEntry.context.setTransform(1, 0, 0, 1, 0, 0);
      } else {
       var canvas = createScratchCanvas(width, height);
       var ctx = canvas.getContext('2d');
       if (trackTransform) {
        addContextCurrentTransform(ctx);
       }
       this.cache[id] = canvasEntry = {
        canvas: canvas,
        context: ctx
       };
      }
      return canvasEntry;
     },
     clear: function () {
      for (var id in this.cache) {
       var canvasEntry = this.cache[id];
       canvasEntry.canvas.width = 0;
       canvasEntry.canvas.height = 0;
       delete this.cache[id];
      }
     }
    };
    return CachedCanvases;
   }();
   function compileType3Glyph(imgData) {
    var POINT_TO_PROCESS_LIMIT = 1000;
    var width = imgData.width, height = imgData.height;
    var i, j, j0, width1 = width + 1;
    var points = new Uint8Array(width1 * (height + 1));
    var POINT_TYPES = new Uint8Array([
     0,
     2,
     4,
     0,
     1,
     0,
     5,
     4,
     8,
     10,
     0,
     8,
     0,
     2,
     1,
     0
    ]);
    var lineSize = width + 7 & ~7, data0 = imgData.data;
    var data = new Uint8Array(lineSize * height), pos = 0, ii;
    for (i = 0, ii = data0.length; i < ii; i++) {
     var mask = 128, elem = data0[i];
     while (mask > 0) {
      data[pos++] = elem & mask ? 0 : 255;
      mask >>= 1;
     }
    }
    var count = 0;
    pos = 0;
    if (data[pos] !== 0) {
     points[0] = 1;
     ++count;
    }
    for (j = 1; j < width; j++) {
     if (data[pos] !== data[pos + 1]) {
      points[j] = data[pos] ? 2 : 1;
      ++count;
     }
     pos++;
    }
    if (data[pos] !== 0) {
     points[j] = 2;
     ++count;
    }
    for (i = 1; i < height; i++) {
     pos = i * lineSize;
     j0 = i * width1;
     if (data[pos - lineSize] !== data[pos]) {
      points[j0] = data[pos] ? 1 : 8;
      ++count;
     }
     var sum = (data[pos] ? 4 : 0) + (data[pos - lineSize] ? 8 : 0);
     for (j = 1; j < width; j++) {
      sum = (sum >> 2) + (data[pos + 1] ? 4 : 0) + (data[pos - lineSize + 1] ? 8 : 0);
      if (POINT_TYPES[sum]) {
       points[j0 + j] = POINT_TYPES[sum];
       ++count;
      }
      pos++;
     }
     if (data[pos - lineSize] !== data[pos]) {
      points[j0 + j] = data[pos] ? 2 : 4;
      ++count;
     }
     if (count > POINT_TO_PROCESS_LIMIT) {
      return null;
     }
    }
    pos = lineSize * (height - 1);
    j0 = i * width1;
    if (data[pos] !== 0) {
     points[j0] = 8;
     ++count;
    }
    for (j = 1; j < width; j++) {
     if (data[pos] !== data[pos + 1]) {
      points[j0 + j] = data[pos] ? 4 : 8;
      ++count;
     }
     pos++;
    }
    if (data[pos] !== 0) {
     points[j0 + j] = 4;
     ++count;
    }
    if (count > POINT_TO_PROCESS_LIMIT) {
     return null;
    }
    var steps = new Int32Array([
     0,
     width1,
     -1,
     0,
     -width1,
     0,
     0,
     0,
     1
    ]);
    var outlines = [];
    for (i = 0; count && i <= height; i++) {
     var p = i * width1;
     var end = p + width;
     while (p < end && !points[p]) {
      p++;
     }
     if (p === end) {
      continue;
     }
     var coords = [
      p % width1,
      i
     ];
     var type = points[p], p0 = p, pp;
     do {
      var step = steps[type];
      do {
       p += step;
      } while (!points[p]);
      pp = points[p];
      if (pp !== 5 && pp !== 10) {
       type = pp;
       points[p] = 0;
      } else {
       type = pp & 0x33 * type >> 4;
       points[p] &= type >> 2 | type << 2;
      }
      coords.push(p % width1);
      coords.push(p / width1 | 0);
      --count;
     } while (p0 !== p);
     outlines.push(coords);
     --i;
    }
    var drawOutline = function (c) {
     c.save();
     c.scale(1 / width, -1 / height);
     c.translate(0, -height);
     c.beginPath();
     for (var i = 0, ii = outlines.length; i < ii; i++) {
      var o = outlines[i];
      c.moveTo(o[0], o[1]);
      for (var j = 2, jj = o.length; j < jj; j += 2) {
       c.lineTo(o[j], o[j + 1]);
      }
     }
     c.fill();
     c.beginPath();
     c.restore();
    };
    return drawOutline;
   }
   var CanvasExtraState = function CanvasExtraStateClosure() {
    function CanvasExtraState(old) {
     this.alphaIsShape = false;
     this.fontSize = 0;
     this.fontSizeScale = 1;
     this.textMatrix = IDENTITY_MATRIX;
     this.textMatrixScale = 1;
     this.fontMatrix = FONT_IDENTITY_MATRIX;
     this.leading = 0;
     this.x = 0;
     this.y = 0;
     this.lineX = 0;
     this.lineY = 0;
     this.charSpacing = 0;
     this.wordSpacing = 0;
     this.textHScale = 1;
     this.textRenderingMode = TextRenderingMode.FILL;
     this.textRise = 0;
     this.fillColor = '#000000';
     this.strokeColor = '#000000';
     this.patternFill = false;
     this.fillAlpha = 1;
     this.strokeAlpha = 1;
     this.lineWidth = 1;
     this.activeSMask = null;
     this.resumeSMaskCtx = null;
     this.old = old;
    }
    CanvasExtraState.prototype = {
     clone: function CanvasExtraState_clone() {
      return Object.create(this);
     },
     setCurrentPoint: function CanvasExtraState_setCurrentPoint(x, y) {
      this.x = x;
      this.y = y;
     }
    };
    return CanvasExtraState;
   }();
   var CanvasGraphics = function CanvasGraphicsClosure() {
    var EXECUTION_TIME = 15;
    var EXECUTION_STEPS = 10;
    function CanvasGraphics(canvasCtx, commonObjs, objs, imageLayer) {
     this.ctx = canvasCtx;
     this.current = new CanvasExtraState();
     this.stateStack = [];
     this.pendingClip = null;
     this.pendingEOFill = false;
     this.res = null;
     this.xobjs = null;
     this.commonObjs = commonObjs;
     this.objs = objs;
     this.imageLayer = imageLayer;
     this.groupStack = [];
     this.processingType3 = null;
     this.baseTransform = null;
     this.baseTransformStack = [];
     this.groupLevel = 0;
     this.smaskStack = [];
     this.smaskCounter = 0;
     this.tempSMask = null;
     this.cachedCanvases = new CachedCanvases();
     if (canvasCtx) {
      addContextCurrentTransform(canvasCtx);
     }
     this.cachedGetSinglePixelWidth = null;
    }
    function putBinaryImageData(ctx, imgData) {
     if (typeof ImageData !== 'undefined' && imgData instanceof ImageData) {
      ctx.putImageData(imgData, 0, 0);
      return;
     }
     var height = imgData.height, width = imgData.width;
     var partialChunkHeight = height % FULL_CHUNK_HEIGHT;
     var fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
     var totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
     var chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
     var srcPos = 0, destPos;
     var src = imgData.data;
     var dest = chunkImgData.data;
     var i, j, thisChunkHeight, elemsInThisChunk;
     if (imgData.kind === ImageKind.GRAYSCALE_1BPP) {
      var srcLength = src.byteLength;
      var dest32 = HasCanvasTypedArraysCached.value ? new Uint32Array(dest.buffer) : new Uint32ArrayView(dest);
      var dest32DataLength = dest32.length;
      var fullSrcDiff = width + 7 >> 3;
      var white = 0xFFFFFFFF;
      var black = IsLittleEndianCached.value || !HasCanvasTypedArraysCached.value ? 0xFF000000 : 0x000000FF;
      for (i = 0; i < totalChunks; i++) {
       thisChunkHeight = i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
       destPos = 0;
       for (j = 0; j < thisChunkHeight; j++) {
        var srcDiff = srcLength - srcPos;
        var k = 0;
        var kEnd = srcDiff > fullSrcDiff ? width : srcDiff * 8 - 7;
        var kEndUnrolled = kEnd & ~7;
        var mask = 0;
        var srcByte = 0;
        for (; k < kEndUnrolled; k += 8) {
         srcByte = src[srcPos++];
         dest32[destPos++] = srcByte & 128 ? white : black;
         dest32[destPos++] = srcByte & 64 ? white : black;
         dest32[destPos++] = srcByte & 32 ? white : black;
         dest32[destPos++] = srcByte & 16 ? white : black;
         dest32[destPos++] = srcByte & 8 ? white : black;
         dest32[destPos++] = srcByte & 4 ? white : black;
         dest32[destPos++] = srcByte & 2 ? white : black;
         dest32[destPos++] = srcByte & 1 ? white : black;
        }
        for (; k < kEnd; k++) {
         if (mask === 0) {
          srcByte = src[srcPos++];
          mask = 128;
         }
         dest32[destPos++] = srcByte & mask ? white : black;
         mask >>= 1;
        }
       }
       while (destPos < dest32DataLength) {
        dest32[destPos++] = 0;
       }
       ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
      }
     } else if (imgData.kind === ImageKind.RGBA_32BPP) {
      j = 0;
      elemsInThisChunk = width * FULL_CHUNK_HEIGHT * 4;
      for (i = 0; i < fullChunks; i++) {
       dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
       srcPos += elemsInThisChunk;
       ctx.putImageData(chunkImgData, 0, j);
       j += FULL_CHUNK_HEIGHT;
      }
      if (i < totalChunks) {
       elemsInThisChunk = width * partialChunkHeight * 4;
       dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
       ctx.putImageData(chunkImgData, 0, j);
      }
     } else if (imgData.kind === ImageKind.RGB_24BPP) {
      thisChunkHeight = FULL_CHUNK_HEIGHT;
      elemsInThisChunk = width * thisChunkHeight;
      for (i = 0; i < totalChunks; i++) {
       if (i >= fullChunks) {
        thisChunkHeight = partialChunkHeight;
        elemsInThisChunk = width * thisChunkHeight;
       }
       destPos = 0;
       for (j = elemsInThisChunk; j--;) {
        dest[destPos++] = src[srcPos++];
        dest[destPos++] = src[srcPos++];
        dest[destPos++] = src[srcPos++];
        dest[destPos++] = 255;
       }
       ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
      }
     } else {
      error('bad image kind: ' + imgData.kind);
     }
    }
    function putBinaryImageMask(ctx, imgData) {
     var height = imgData.height, width = imgData.width;
     var partialChunkHeight = height % FULL_CHUNK_HEIGHT;
     var fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
     var totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
     var chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
     var srcPos = 0;
     var src = imgData.data;
     var dest = chunkImgData.data;
     for (var i = 0; i < totalChunks; i++) {
      var thisChunkHeight = i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
      var destPos = 3;
      for (var j = 0; j < thisChunkHeight; j++) {
       var mask = 0;
       for (var k = 0; k < width; k++) {
        if (!mask) {
         var elem = src[srcPos++];
         mask = 128;
        }
        dest[destPos] = elem & mask ? 0 : 255;
        destPos += 4;
        mask >>= 1;
       }
      }
      ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
     }
    }
    function copyCtxState(sourceCtx, destCtx) {
     var properties = [
      'strokeStyle',
      'fillStyle',
      'fillRule',
      'globalAlpha',
      'lineWidth',
      'lineCap',
      'lineJoin',
      'miterLimit',
      'globalCompositeOperation',
      'font'
     ];
     for (var i = 0, ii = properties.length; i < ii; i++) {
      var property = properties[i];
      if (sourceCtx[property] !== undefined) {
       destCtx[property] = sourceCtx[property];
      }
     }
     if (sourceCtx.setLineDash !== undefined) {
      destCtx.setLineDash(sourceCtx.getLineDash());
      destCtx.lineDashOffset = sourceCtx.lineDashOffset;
     }
    }
    function composeSMaskBackdrop(bytes, r0, g0, b0) {
     var length = bytes.length;
     for (var i = 3; i < length; i += 4) {
      var alpha = bytes[i];
      if (alpha === 0) {
       bytes[i - 3] = r0;
       bytes[i - 2] = g0;
       bytes[i - 1] = b0;
      } else if (alpha < 255) {
       var alpha_ = 255 - alpha;
       bytes[i - 3] = bytes[i - 3] * alpha + r0 * alpha_ >> 8;
       bytes[i - 2] = bytes[i - 2] * alpha + g0 * alpha_ >> 8;
       bytes[i - 1] = bytes[i - 1] * alpha + b0 * alpha_ >> 8;
      }
     }
    }
    function composeSMaskAlpha(maskData, layerData, transferMap) {
     var length = maskData.length;
     var scale = 1 / 255;
     for (var i = 3; i < length; i += 4) {
      var alpha = transferMap ? transferMap[maskData[i]] : maskData[i];
      layerData[i] = layerData[i] * alpha * scale | 0;
     }
    }
    function composeSMaskLuminosity(maskData, layerData, transferMap) {
     var length = maskData.length;
     for (var i = 3; i < length; i += 4) {
      var y = maskData[i - 3] * 77 + maskData[i - 2] * 152 + maskData[i - 1] * 28;
      layerData[i] = transferMap ? layerData[i] * transferMap[y >> 8] >> 8 : layerData[i] * y >> 16;
     }
    }
    function genericComposeSMask(maskCtx, layerCtx, width, height, subtype, backdrop, transferMap) {
     var hasBackdrop = !!backdrop;
     var r0 = hasBackdrop ? backdrop[0] : 0;
     var g0 = hasBackdrop ? backdrop[1] : 0;
     var b0 = hasBackdrop ? backdrop[2] : 0;
     var composeFn;
     if (subtype === 'Luminosity') {
      composeFn = composeSMaskLuminosity;
     } else {
      composeFn = composeSMaskAlpha;
     }
     var PIXELS_TO_PROCESS = 1048576;
     var chunkSize = Math.min(height, Math.ceil(PIXELS_TO_PROCESS / width));
     for (var row = 0; row < height; row += chunkSize) {
      var chunkHeight = Math.min(chunkSize, height - row);
      var maskData = maskCtx.getImageData(0, row, width, chunkHeight);
      var layerData = layerCtx.getImageData(0, row, width, chunkHeight);
      if (hasBackdrop) {
       composeSMaskBackdrop(maskData.data, r0, g0, b0);
      }
      composeFn(maskData.data, layerData.data, transferMap);
      maskCtx.putImageData(layerData, 0, row);
     }
    }
    function composeSMask(ctx, smask, layerCtx) {
     var mask = smask.canvas;
     var maskCtx = smask.context;
     ctx.setTransform(smask.scaleX, 0, 0, smask.scaleY, smask.offsetX, smask.offsetY);
     var backdrop = smask.backdrop || null;
     if (!smask.transferMap && WebGLUtils.isEnabled) {
      var composed = WebGLUtils.composeSMask(layerCtx.canvas, mask, {
       subtype: smask.subtype,
       backdrop: backdrop
      });
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(composed, smask.offsetX, smask.offsetY);
      return;
     }
     genericComposeSMask(maskCtx, layerCtx, mask.width, mask.height, smask.subtype, backdrop, smask.transferMap);
     ctx.drawImage(mask, 0, 0);
    }
    var LINE_CAP_STYLES = [
     'butt',
     'round',
     'square'
    ];
    var LINE_JOIN_STYLES = [
     'miter',
     'round',
     'bevel'
    ];
    var NORMAL_CLIP = {};
    var EO_CLIP = {};
    CanvasGraphics.prototype = {
     beginDrawing: function CanvasGraphics_beginDrawing(transform, viewport, transparency) {
      var width = this.ctx.canvas.width;
      var height = this.ctx.canvas.height;
      this.ctx.save();
      this.ctx.fillStyle = 'rgb(255, 255, 255)';
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.restore();
      if (transparency) {
       var transparentCanvas = this.cachedCanvases.getCanvas('transparent', width, height, true);
       this.compositeCtx = this.ctx;
       this.transparentCanvas = transparentCanvas.canvas;
       this.ctx = transparentCanvas.context;
       this.ctx.save();
       this.ctx.transform.apply(this.ctx, this.compositeCtx.mozCurrentTransform);
      }
      this.ctx.save();
      if (transform) {
       this.ctx.transform.apply(this.ctx, transform);
      }
      this.ctx.transform.apply(this.ctx, viewport.transform);
      this.baseTransform = this.ctx.mozCurrentTransform.slice();
      if (this.imageLayer) {
       this.imageLayer.beginLayout();
      }
     },
     executeOperatorList: function CanvasGraphics_executeOperatorList(operatorList, executionStartIdx, continueCallback, stepper) {
      var argsArray = operatorList.argsArray;
      var fnArray = operatorList.fnArray;
      var i = executionStartIdx || 0;
      var argsArrayLen = argsArray.length;
      if (argsArrayLen === i) {
       return i;
      }
      var chunkOperations = argsArrayLen - i > EXECUTION_STEPS && typeof continueCallback === 'function';
      var endTime = chunkOperations ? Date.now() + EXECUTION_TIME : 0;
      var steps = 0;
      var commonObjs = this.commonObjs;
      var objs = this.objs;
      var fnId;
      while (true) {
       if (stepper !== undefined && i === stepper.nextBreakPoint) {
        stepper.breakIt(i, continueCallback);
        return i;
       }
       fnId = fnArray[i];
       if (fnId !== OPS.dependency) {
        this[fnId].apply(this, argsArray[i]);
       } else {
        var deps = argsArray[i];
        for (var n = 0, nn = deps.length; n < nn; n++) {
         var depObjId = deps[n];
         var common = depObjId[0] === 'g' && depObjId[1] === '_';
         var objsPool = common ? commonObjs : objs;
         if (!objsPool.isResolved(depObjId)) {
          objsPool.get(depObjId, continueCallback);
          return i;
         }
        }
       }
       i++;
       if (i === argsArrayLen) {
        return i;
       }
       if (chunkOperations && ++steps > EXECUTION_STEPS) {
        if (Date.now() > endTime) {
         continueCallback();
         return i;
        }
        steps = 0;
       }
      }
     },
     endDrawing: function CanvasGraphics_endDrawing() {
      if (this.current.activeSMask !== null) {
       this.endSMaskGroup();
      }
      this.ctx.restore();
      if (this.transparentCanvas) {
       this.ctx = this.compositeCtx;
       this.ctx.save();
       this.ctx.setTransform(1, 0, 0, 1, 0, 0);
       this.ctx.drawImage(this.transparentCanvas, 0, 0);
       this.ctx.restore();
       this.transparentCanvas = null;
      }
      this.cachedCanvases.clear();
      WebGLUtils.clear();
      if (this.imageLayer) {
       this.imageLayer.endLayout();
      }
     },
     setLineWidth: function CanvasGraphics_setLineWidth(width) {
      this.current.lineWidth = width;
      this.ctx.lineWidth = width;
     },
     setLineCap: function CanvasGraphics_setLineCap(style) {
      this.ctx.lineCap = LINE_CAP_STYLES[style];
     },
     setLineJoin: function CanvasGraphics_setLineJoin(style) {
      this.ctx.lineJoin = LINE_JOIN_STYLES[style];
     },
     setMiterLimit: function CanvasGraphics_setMiterLimit(limit) {
      this.ctx.miterLimit = limit;
     },
     setDash: function CanvasGraphics_setDash(dashArray, dashPhase) {
      var ctx = this.ctx;
      if (ctx.setLineDash !== undefined) {
       ctx.setLineDash(dashArray);
       ctx.lineDashOffset = dashPhase;
      }
     },
     setRenderingIntent: function CanvasGraphics_setRenderingIntent(intent) {
     },
     setFlatness: function CanvasGraphics_setFlatness(flatness) {
     },
     setGState: function CanvasGraphics_setGState(states) {
      for (var i = 0, ii = states.length; i < ii; i++) {
       var state = states[i];
       var key = state[0];
       var value = state[1];
       switch (key) {
       case 'LW':
        this.setLineWidth(value);
        break;
       case 'LC':
        this.setLineCap(value);
        break;
       case 'LJ':
        this.setLineJoin(value);
        break;
       case 'ML':
        this.setMiterLimit(value);
        break;
       case 'D':
        this.setDash(value[0], value[1]);
        break;
       case 'RI':
        this.setRenderingIntent(value);
        break;
       case 'FL':
        this.setFlatness(value);
        break;
       case 'Font':
        this.setFont(value[0], value[1]);
        break;
       case 'CA':
        this.current.strokeAlpha = state[1];
        break;
       case 'ca':
        this.current.fillAlpha = state[1];
        this.ctx.globalAlpha = state[1];
        break;
       case 'BM':
        if (value && value.name && value.name !== 'Normal') {
         var mode = value.name.replace(/([A-Z])/g, function (c) {
          return '-' + c.toLowerCase();
         }).substring(1);
         this.ctx.globalCompositeOperation = mode;
         if (this.ctx.globalCompositeOperation !== mode) {
          warn('globalCompositeOperation "' + mode + '" is not supported');
         }
        } else {
         this.ctx.globalCompositeOperation = 'source-over';
        }
        break;
       case 'SMask':
        if (this.current.activeSMask) {
         if (this.stateStack.length > 0 && this.stateStack[this.stateStack.length - 1].activeSMask === this.current.activeSMask) {
          this.suspendSMaskGroup();
         } else {
          this.endSMaskGroup();
         }
        }
        this.current.activeSMask = value ? this.tempSMask : null;
        if (this.current.activeSMask) {
         this.beginSMaskGroup();
        }
        this.tempSMask = null;
        break;
       }
      }
     },
     beginSMaskGroup: function CanvasGraphics_beginSMaskGroup() {
      var activeSMask = this.current.activeSMask;
      var drawnWidth = activeSMask.canvas.width;
      var drawnHeight = activeSMask.canvas.height;
      var cacheId = 'smaskGroupAt' + this.groupLevel;
      var scratchCanvas = this.cachedCanvases.getCanvas(cacheId, drawnWidth, drawnHeight, true);
      var currentCtx = this.ctx;
      var currentTransform = currentCtx.mozCurrentTransform;
      this.ctx.save();
      var groupCtx = scratchCanvas.context;
      groupCtx.scale(1 / activeSMask.scaleX, 1 / activeSMask.scaleY);
      groupCtx.translate(-activeSMask.offsetX, -activeSMask.offsetY);
      groupCtx.transform.apply(groupCtx, currentTransform);
      activeSMask.startTransformInverse = groupCtx.mozCurrentTransformInverse;
      copyCtxState(currentCtx, groupCtx);
      this.ctx = groupCtx;
      this.setGState([
       [
        'BM',
        'Normal'
       ],
       [
        'ca',
        1
       ],
       [
        'CA',
        1
       ]
      ]);
      this.groupStack.push(currentCtx);
      this.groupLevel++;
     },
     suspendSMaskGroup: function CanvasGraphics_endSMaskGroup() {
      var groupCtx = this.ctx;
      this.groupLevel--;
      this.ctx = this.groupStack.pop();
      composeSMask(this.ctx, this.current.activeSMask, groupCtx);
      this.ctx.restore();
      this.ctx.save();
      copyCtxState(groupCtx, this.ctx);
      this.current.resumeSMaskCtx = groupCtx;
      var deltaTransform = Util.transform(this.current.activeSMask.startTransformInverse, groupCtx.mozCurrentTransform);
      this.ctx.transform.apply(this.ctx, deltaTransform);
      groupCtx.save();
      groupCtx.setTransform(1, 0, 0, 1, 0, 0);
      groupCtx.clearRect(0, 0, groupCtx.canvas.width, groupCtx.canvas.height);
      groupCtx.restore();
     },
     resumeSMaskGroup: function CanvasGraphics_endSMaskGroup() {
      var groupCtx = this.current.resumeSMaskCtx;
      var currentCtx = this.ctx;
      this.ctx = groupCtx;
      this.groupStack.push(currentCtx);
      this.groupLevel++;
     },
     endSMaskGroup: function CanvasGraphics_endSMaskGroup() {
      var groupCtx = this.ctx;
      this.groupLevel--;
      this.ctx = this.groupStack.pop();
      composeSMask(this.ctx, this.current.activeSMask, groupCtx);
      this.ctx.restore();
      copyCtxState(groupCtx, this.ctx);
      var deltaTransform = Util.transform(this.current.activeSMask.startTransformInverse, groupCtx.mozCurrentTransform);
      this.ctx.transform.apply(this.ctx, deltaTransform);
     },
     save: function CanvasGraphics_save() {
      this.ctx.save();
      var old = this.current;
      this.stateStack.push(old);
      this.current = old.clone();
      this.current.resumeSMaskCtx = null;
     },
     restore: function CanvasGraphics_restore() {
      if (this.current.resumeSMaskCtx) {
       this.resumeSMaskGroup();
      }
      if (this.current.activeSMask !== null && (this.stateStack.length === 0 || this.stateStack[this.stateStack.length - 1].activeSMask !== this.current.activeSMask)) {
       this.endSMaskGroup();
      }
      if (this.stateStack.length !== 0) {
       this.current = this.stateStack.pop();
       this.ctx.restore();
       this.pendingClip = null;
       this.cachedGetSinglePixelWidth = null;
      }
     },
     transform: function CanvasGraphics_transform(a, b, c, d, e, f) {
      this.ctx.transform(a, b, c, d, e, f);
      this.cachedGetSinglePixelWidth = null;
     },
     constructPath: function CanvasGraphics_constructPath(ops, args) {
      var ctx = this.ctx;
      var current = this.current;
      var x = current.x, y = current.y;
      for (var i = 0, j = 0, ii = ops.length; i < ii; i++) {
       switch (ops[i] | 0) {
       case OPS.rectangle:
        x = args[j++];
        y = args[j++];
        var width = args[j++];
        var height = args[j++];
        if (width === 0) {
         width = this.getSinglePixelWidth();
        }
        if (height === 0) {
         height = this.getSinglePixelWidth();
        }
        var xw = x + width;
        var yh = y + height;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(xw, y);
        this.ctx.lineTo(xw, yh);
        this.ctx.lineTo(x, yh);
        this.ctx.lineTo(x, y);
        this.ctx.closePath();
        break;
       case OPS.moveTo:
        x = args[j++];
        y = args[j++];
        ctx.moveTo(x, y);
        break;
       case OPS.lineTo:
        x = args[j++];
        y = args[j++];
        ctx.lineTo(x, y);
        break;
       case OPS.curveTo:
        x = args[j + 4];
        y = args[j + 5];
        ctx.bezierCurveTo(args[j], args[j + 1], args[j + 2], args[j + 3], x, y);
        j += 6;
        break;
       case OPS.curveTo2:
        ctx.bezierCurveTo(x, y, args[j], args[j + 1], args[j + 2], args[j + 3]);
        x = args[j + 2];
        y = args[j + 3];
        j += 4;
        break;
       case OPS.curveTo3:
        x = args[j + 2];
        y = args[j + 3];
        ctx.bezierCurveTo(args[j], args[j + 1], x, y, x, y);
        j += 4;
        break;
       case OPS.closePath:
        ctx.closePath();
        break;
       }
      }
      current.setCurrentPoint(x, y);
     },
     closePath: function CanvasGraphics_closePath() {
      this.ctx.closePath();
     },
     stroke: function CanvasGraphics_stroke(consumePath) {
      consumePath = typeof consumePath !== 'undefined' ? consumePath : true;
      var ctx = this.ctx;
      var strokeColor = this.current.strokeColor;
      ctx.lineWidth = Math.max(this.getSinglePixelWidth() * MIN_WIDTH_FACTOR, this.current.lineWidth);
      ctx.globalAlpha = this.current.strokeAlpha;
      if (strokeColor && strokeColor.hasOwnProperty('type') && strokeColor.type === 'Pattern') {
       ctx.save();
       ctx.strokeStyle = strokeColor.getPattern(ctx, this);
       ctx.stroke();
       ctx.restore();
      } else {
       ctx.stroke();
      }
      if (consumePath) {
       this.consumePath();
      }
      ctx.globalAlpha = this.current.fillAlpha;
     },
     closeStroke: function CanvasGraphics_closeStroke() {
      this.closePath();
      this.stroke();
     },
     fill: function CanvasGraphics_fill(consumePath) {
      consumePath = typeof consumePath !== 'undefined' ? consumePath : true;
      var ctx = this.ctx;
      var fillColor = this.current.fillColor;
      var isPatternFill = this.current.patternFill;
      var needRestore = false;
      if (isPatternFill) {
       ctx.save();
       if (this.baseTransform) {
        ctx.setTransform.apply(ctx, this.baseTransform);
       }
       ctx.fillStyle = fillColor.getPattern(ctx, this);
       needRestore = true;
      }
      if (this.pendingEOFill) {
       if (ctx.mozFillRule !== undefined) {
        ctx.mozFillRule = 'evenodd';
        ctx.fill();
        ctx.mozFillRule = 'nonzero';
       } else {
        ctx.fill('evenodd');
       }
       this.pendingEOFill = false;
      } else {
       ctx.fill();
      }
      if (needRestore) {
       ctx.restore();
      }
      if (consumePath) {
       this.consumePath();
      }
     },
     eoFill: function CanvasGraphics_eoFill() {
      this.pendingEOFill = true;
      this.fill();
     },
     fillStroke: function CanvasGraphics_fillStroke() {
      this.fill(false);
      this.stroke(false);
      this.consumePath();
     },
     eoFillStroke: function CanvasGraphics_eoFillStroke() {
      this.pendingEOFill = true;
      this.fillStroke();
     },
     closeFillStroke: function CanvasGraphics_closeFillStroke() {
      this.closePath();
      this.fillStroke();
     },
     closeEOFillStroke: function CanvasGraphics_closeEOFillStroke() {
      this.pendingEOFill = true;
      this.closePath();
      this.fillStroke();
     },
     endPath: function CanvasGraphics_endPath() {
      this.consumePath();
     },
     clip: function CanvasGraphics_clip() {
      this.pendingClip = NORMAL_CLIP;
     },
     eoClip: function CanvasGraphics_eoClip() {
      this.pendingClip = EO_CLIP;
     },
     beginText: function CanvasGraphics_beginText() {
      this.current.textMatrix = IDENTITY_MATRIX;
      this.current.textMatrixScale = 1;
      this.current.x = this.current.lineX = 0;
      this.current.y = this.current.lineY = 0;
     },
     endText: function CanvasGraphics_endText() {
      var paths = this.pendingTextPaths;
      var ctx = this.ctx;
      if (paths === undefined) {
       ctx.beginPath();
       return;
      }
      ctx.save();
      ctx.beginPath();
      for (var i = 0; i < paths.length; i++) {
       var path = paths[i];
       ctx.setTransform.apply(ctx, path.transform);
       ctx.translate(path.x, path.y);
       path.addToPath(ctx, path.fontSize);
      }
      ctx.restore();
      ctx.clip();
      ctx.beginPath();
      delete this.pendingTextPaths;
     },
     setCharSpacing: function CanvasGraphics_setCharSpacing(spacing) {
      this.current.charSpacing = spacing;
     },
     setWordSpacing: function CanvasGraphics_setWordSpacing(spacing) {
      this.current.wordSpacing = spacing;
     },
     setHScale: function CanvasGraphics_setHScale(scale) {
      this.current.textHScale = scale / 100;
     },
     setLeading: function CanvasGraphics_setLeading(leading) {
      this.current.leading = -leading;
     },
     setFont: function CanvasGraphics_setFont(fontRefName, size) {
      var fontObj = this.commonObjs.get(fontRefName);
      var current = this.current;
      if (!fontObj) {
       error('Can\'t find font for ' + fontRefName);
      }
      current.fontMatrix = fontObj.fontMatrix ? fontObj.fontMatrix : FONT_IDENTITY_MATRIX;
      if (current.fontMatrix[0] === 0 || current.fontMatrix[3] === 0) {
       warn('Invalid font matrix for font ' + fontRefName);
      }
      if (size < 0) {
       size = -size;
       current.fontDirection = -1;
      } else {
       current.fontDirection = 1;
      }
      this.current.font = fontObj;
      this.current.fontSize = size;
      if (fontObj.isType3Font) {
       return;
      }
      var name = fontObj.loadedName || 'sans-serif';
      var bold = fontObj.black ? '900' : fontObj.bold ? 'bold' : 'normal';
      var italic = fontObj.italic ? 'italic' : 'normal';
      var typeface = '"' + name + '", ' + fontObj.fallbackName;
      var browserFontSize = size < MIN_FONT_SIZE ? MIN_FONT_SIZE : size > MAX_FONT_SIZE ? MAX_FONT_SIZE : size;
      this.current.fontSizeScale = size / browserFontSize;
      var rule = italic + ' ' + bold + ' ' + browserFontSize + 'px ' + typeface;
      this.ctx.font = rule;
     },
     setTextRenderingMode: function CanvasGraphics_setTextRenderingMode(mode) {
      this.current.textRenderingMode = mode;
     },
     setTextRise: function CanvasGraphics_setTextRise(rise) {
      this.current.textRise = rise;
     },
     moveText: function CanvasGraphics_moveText(x, y) {
      this.current.x = this.current.lineX += x;
      this.current.y = this.current.lineY += y;
     },
     setLeadingMoveText: function CanvasGraphics_setLeadingMoveText(x, y) {
      this.setLeading(-y);
      this.moveText(x, y);
     },
     setTextMatrix: function CanvasGraphics_setTextMatrix(a, b, c, d, e, f) {
      this.current.textMatrix = [
       a,
       b,
       c,
       d,
       e,
       f
      ];
      this.current.textMatrixScale = Math.sqrt(a * a + b * b);
      this.current.x = this.current.lineX = 0;
      this.current.y = this.current.lineY = 0;
     },
     nextLine: function CanvasGraphics_nextLine() {
      this.moveText(0, this.current.leading);
     },
     paintChar: function CanvasGraphics_paintChar(character, x, y) {
      var ctx = this.ctx;
      var current = this.current;
      var font = current.font;
      var textRenderingMode = current.textRenderingMode;
      var fontSize = current.fontSize / current.fontSizeScale;
      var fillStrokeMode = textRenderingMode & TextRenderingMode.FILL_STROKE_MASK;
      var isAddToPathSet = !!(textRenderingMode & TextRenderingMode.ADD_TO_PATH_FLAG);
      var addToPath;
      if (font.disableFontFace || isAddToPathSet) {
       addToPath = font.getPathGenerator(this.commonObjs, character);
      }
      if (font.disableFontFace) {
       ctx.save();
       ctx.translate(x, y);
       ctx.beginPath();
       addToPath(ctx, fontSize);
       if (fillStrokeMode === TextRenderingMode.FILL || fillStrokeMode === TextRenderingMode.FILL_STROKE) {
        ctx.fill();
       }
       if (fillStrokeMode === TextRenderingMode.STROKE || fillStrokeMode === TextRenderingMode.FILL_STROKE) {
        ctx.stroke();
       }
       ctx.restore();
      } else {
       if (fillStrokeMode === TextRenderingMode.FILL || fillStrokeMode === TextRenderingMode.FILL_STROKE) {
        ctx.fillText(character, x, y);
       }
       if (fillStrokeMode === TextRenderingMode.STROKE || fillStrokeMode === TextRenderingMode.FILL_STROKE) {
        ctx.strokeText(character, x, y);
       }
      }
      if (isAddToPathSet) {
       var paths = this.pendingTextPaths || (this.pendingTextPaths = []);
       paths.push({
        transform: ctx.mozCurrentTransform,
        x: x,
        y: y,
        fontSize: fontSize,
        addToPath: addToPath
       });
      }
     },
     get isFontSubpixelAAEnabled() {
      var ctx = document.createElement('canvas').getContext('2d');
      ctx.scale(1.5, 1);
      ctx.fillText('I', 0, 10);
      var data = ctx.getImageData(0, 0, 10, 10).data;
      var enabled = false;
      for (var i = 3; i < data.length; i += 4) {
       if (data[i] > 0 && data[i] < 255) {
        enabled = true;
        break;
       }
      }
      return shadow(this, 'isFontSubpixelAAEnabled', enabled);
     },
     showText: function CanvasGraphics_showText(glyphs) {
      var current = this.current;
      var font = current.font;
      if (font.isType3Font) {
       return this.showType3Text(glyphs);
      }
      var fontSize = current.fontSize;
      if (fontSize === 0) {
       return;
      }
      var ctx = this.ctx;
      var fontSizeScale = current.fontSizeScale;
      var charSpacing = current.charSpacing;
      var wordSpacing = current.wordSpacing;
      var fontDirection = current.fontDirection;
      var textHScale = current.textHScale * fontDirection;
      var glyphsLength = glyphs.length;
      var vertical = font.vertical;
      var spacingDir = vertical ? 1 : -1;
      var defaultVMetrics = font.defaultVMetrics;
      var widthAdvanceScale = fontSize * current.fontMatrix[0];
      var simpleFillText = current.textRenderingMode === TextRenderingMode.FILL && !font.disableFontFace;
      ctx.save();
      ctx.transform.apply(ctx, current.textMatrix);
      ctx.translate(current.x, current.y + current.textRise);
      if (current.patternFill) {
       ctx.fillStyle = current.fillColor.getPattern(ctx, this);
      }
      if (fontDirection > 0) {
       ctx.scale(textHScale, -1);
      } else {
       ctx.scale(textHScale, 1);
      }
      var lineWidth = current.lineWidth;
      var scale = current.textMatrixScale;
      if (scale === 0 || lineWidth === 0) {
       var fillStrokeMode = current.textRenderingMode & TextRenderingMode.FILL_STROKE_MASK;
       if (fillStrokeMode === TextRenderingMode.STROKE || fillStrokeMode === TextRenderingMode.FILL_STROKE) {
        this.cachedGetSinglePixelWidth = null;
        lineWidth = this.getSinglePixelWidth() * MIN_WIDTH_FACTOR;
       }
      } else {
       lineWidth /= scale;
      }
      if (fontSizeScale !== 1.0) {
       ctx.scale(fontSizeScale, fontSizeScale);
       lineWidth /= fontSizeScale;
      }
      ctx.lineWidth = lineWidth;
      var x = 0, i;
      for (i = 0; i < glyphsLength; ++i) {
       var glyph = glyphs[i];
       if (isNum(glyph)) {
        x += spacingDir * glyph * fontSize / 1000;
        continue;
       }
       var restoreNeeded = false;
       var spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
       var character = glyph.fontChar;
       var accent = glyph.accent;
       var scaledX, scaledY, scaledAccentX, scaledAccentY;
       var width = glyph.width;
       if (vertical) {
        var vmetric, vx, vy;
        vmetric = glyph.vmetric || defaultVMetrics;
        vx = glyph.vmetric ? vmetric[1] : width * 0.5;
        vx = -vx * widthAdvanceScale;
        vy = vmetric[2] * widthAdvanceScale;
        width = vmetric ? -vmetric[0] : width;
        scaledX = vx / fontSizeScale;
        scaledY = (x + vy) / fontSizeScale;
       } else {
        scaledX = x / fontSizeScale;
        scaledY = 0;
       }
       if (font.remeasure && width > 0) {
        var measuredWidth = ctx.measureText(character).width * 1000 / fontSize * fontSizeScale;
        if (width < measuredWidth && this.isFontSubpixelAAEnabled) {
         var characterScaleX = width / measuredWidth;
         restoreNeeded = true;
         ctx.save();
         ctx.scale(characterScaleX, 1);
         scaledX /= characterScaleX;
        } else if (width !== measuredWidth) {
         scaledX += (width - measuredWidth) / 2000 * fontSize / fontSizeScale;
        }
       }
       if (glyph.isInFont || font.missingFile) {
        if (simpleFillText && !accent) {
         ctx.fillText(character, scaledX, scaledY);
        } else {
         this.paintChar(character, scaledX, scaledY);
         if (accent) {
          scaledAccentX = scaledX + accent.offset.x / fontSizeScale;
          scaledAccentY = scaledY - accent.offset.y / fontSizeScale;
          this.paintChar(accent.fontChar, scaledAccentX, scaledAccentY);
         }
        }
       }
       var charWidth = width * widthAdvanceScale + spacing * fontDirection;
       x += charWidth;
       if (restoreNeeded) {
        ctx.restore();
       }
      }
      if (vertical) {
       current.y -= x * textHScale;
      } else {
       current.x += x * textHScale;
      }
      ctx.restore();
     },
     showType3Text: function CanvasGraphics_showType3Text(glyphs) {
      var ctx = this.ctx;
      var current = this.current;
      var font = current.font;
      var fontSize = current.fontSize;
      var fontDirection = current.fontDirection;
      var spacingDir = font.vertical ? 1 : -1;
      var charSpacing = current.charSpacing;
      var wordSpacing = current.wordSpacing;
      var textHScale = current.textHScale * fontDirection;
      var fontMatrix = current.fontMatrix || FONT_IDENTITY_MATRIX;
      var glyphsLength = glyphs.length;
      var isTextInvisible = current.textRenderingMode === TextRenderingMode.INVISIBLE;
      var i, glyph, width, spacingLength;
      if (isTextInvisible || fontSize === 0) {
       return;
      }
      this.cachedGetSinglePixelWidth = null;
      ctx.save();
      ctx.transform.apply(ctx, current.textMatrix);
      ctx.translate(current.x, current.y);
      ctx.scale(textHScale, fontDirection);
      for (i = 0; i < glyphsLength; ++i) {
       glyph = glyphs[i];
       if (isNum(glyph)) {
        spacingLength = spacingDir * glyph * fontSize / 1000;
        this.ctx.translate(spacingLength, 0);
        current.x += spacingLength * textHScale;
        continue;
       }
       var spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
       var operatorList = font.charProcOperatorList[glyph.operatorListId];
       if (!operatorList) {
        warn('Type3 character \"' + glyph.operatorListId + '\" is not available');
        continue;
       }
       this.processingType3 = glyph;
       this.save();
       ctx.scale(fontSize, fontSize);
       ctx.transform.apply(ctx, fontMatrix);
       this.executeOperatorList(operatorList);
       this.restore();
       var transformed = Util.applyTransform([
        glyph.width,
        0
       ], fontMatrix);
       width = transformed[0] * fontSize + spacing;
       ctx.translate(width, 0);
       current.x += width * textHScale;
      }
      ctx.restore();
      this.processingType3 = null;
     },
     setCharWidth: function CanvasGraphics_setCharWidth(xWidth, yWidth) {
     },
     setCharWidthAndBounds: function CanvasGraphics_setCharWidthAndBounds(xWidth, yWidth, llx, lly, urx, ury) {
      this.ctx.rect(llx, lly, urx - llx, ury - lly);
      this.clip();
      this.endPath();
     },
     getColorN_Pattern: function CanvasGraphics_getColorN_Pattern(IR) {
      var pattern;
      if (IR[0] === 'TilingPattern') {
       var color = IR[1];
       var baseTransform = this.baseTransform || this.ctx.mozCurrentTransform.slice();
       var self = this;
       var canvasGraphicsFactory = {
        createCanvasGraphics: function (ctx) {
         return new CanvasGraphics(ctx, self.commonObjs, self.objs);
        }
       };
       pattern = new TilingPattern(IR, color, this.ctx, canvasGraphicsFactory, baseTransform);
      } else {
       pattern = getShadingPatternFromIR(IR);
      }
      return pattern;
     },
     setStrokeColorN: function CanvasGraphics_setStrokeColorN()
      {
       this.current.strokeColor = this.getColorN_Pattern(arguments);
      },
     setFillColorN: function CanvasGraphics_setFillColorN()
      {
       this.current.fillColor = this.getColorN_Pattern(arguments);
       this.current.patternFill = true;
      },
     setStrokeRGBColor: function CanvasGraphics_setStrokeRGBColor(r, g, b) {
      var color = Util.makeCssRgb(r, g, b);
      this.ctx.strokeStyle = color;
      this.current.strokeColor = color;
     },
     setFillRGBColor: function CanvasGraphics_setFillRGBColor(r, g, b) {
      var color = Util.makeCssRgb(r, g, b);
      this.ctx.fillStyle = color;
      this.current.fillColor = color;
      this.current.patternFill = false;
     },
     shadingFill: function CanvasGraphics_shadingFill(patternIR) {
      var ctx = this.ctx;
      this.save();
      var pattern = getShadingPatternFromIR(patternIR);
      ctx.fillStyle = pattern.getPattern(ctx, this, true);
      var inv = ctx.mozCurrentTransformInverse;
      if (inv) {
       var canvas = ctx.canvas;
       var width = canvas.width;
       var height = canvas.height;
       var bl = Util.applyTransform([
        0,
        0
       ], inv);
       var br = Util.applyTransform([
        0,
        height
       ], inv);
       var ul = Util.applyTransform([
        width,
        0
       ], inv);
       var ur = Util.applyTransform([
        width,
        height
       ], inv);
       var x0 = Math.min(bl[0], br[0], ul[0], ur[0]);
       var y0 = Math.min(bl[1], br[1], ul[1], ur[1]);
       var x1 = Math.max(bl[0], br[0], ul[0], ur[0]);
       var y1 = Math.max(bl[1], br[1], ul[1], ur[1]);
       this.ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      } else {
       this.ctx.fillRect(-1e10, -1e10, 2e10, 2e10);
      }
      this.restore();
     },
     beginInlineImage: function CanvasGraphics_beginInlineImage() {
      error('Should not call beginInlineImage');
     },
     beginImageData: function CanvasGraphics_beginImageData() {
      error('Should not call beginImageData');
     },
     paintFormXObjectBegin: function CanvasGraphics_paintFormXObjectBegin(matrix, bbox) {
      this.save();
      this.baseTransformStack.push(this.baseTransform);
      if (isArray(matrix) && 6 === matrix.length) {
       this.transform.apply(this, matrix);
      }
      this.baseTransform = this.ctx.mozCurrentTransform;
      if (isArray(bbox) && 4 === bbox.length) {
       var width = bbox[2] - bbox[0];
       var height = bbox[3] - bbox[1];
       this.ctx.rect(bbox[0], bbox[1], width, height);
       this.clip();
       this.endPath();
      }
     },
     paintFormXObjectEnd: function CanvasGraphics_paintFormXObjectEnd() {
      this.restore();
      this.baseTransform = this.baseTransformStack.pop();
     },
     beginGroup: function CanvasGraphics_beginGroup(group) {
      this.save();
      var currentCtx = this.ctx;
      if (!group.isolated) {
       info('TODO: Support non-isolated groups.');
      }
      if (group.knockout) {
       warn('Knockout groups not supported.');
      }
      var currentTransform = currentCtx.mozCurrentTransform;
      if (group.matrix) {
       currentCtx.transform.apply(currentCtx, group.matrix);
      }
      assert(group.bbox, 'Bounding box is required.');
      var bounds = Util.getAxialAlignedBoundingBox(group.bbox, currentCtx.mozCurrentTransform);
      var canvasBounds = [
       0,
       0,
       currentCtx.canvas.width,
       currentCtx.canvas.height
      ];
      bounds = Util.intersect(bounds, canvasBounds) || [
       0,
       0,
       0,
       0
      ];
      var offsetX = Math.floor(bounds[0]);
      var offsetY = Math.floor(bounds[1]);
      var drawnWidth = Math.max(Math.ceil(bounds[2]) - offsetX, 1);
      var drawnHeight = Math.max(Math.ceil(bounds[3]) - offsetY, 1);
      var scaleX = 1, scaleY = 1;
      if (drawnWidth > MAX_GROUP_SIZE) {
       scaleX = drawnWidth / MAX_GROUP_SIZE;
       drawnWidth = MAX_GROUP_SIZE;
      }
      if (drawnHeight > MAX_GROUP_SIZE) {
       scaleY = drawnHeight / MAX_GROUP_SIZE;
       drawnHeight = MAX_GROUP_SIZE;
      }
      var cacheId = 'groupAt' + this.groupLevel;
      if (group.smask) {
       cacheId += '_smask_' + this.smaskCounter++ % 2;
      }
      var scratchCanvas = this.cachedCanvases.getCanvas(cacheId, drawnWidth, drawnHeight, true);
      var groupCtx = scratchCanvas.context;
      groupCtx.scale(1 / scaleX, 1 / scaleY);
      groupCtx.translate(-offsetX, -offsetY);
      groupCtx.transform.apply(groupCtx, currentTransform);
      if (group.smask) {
       this.smaskStack.push({
        canvas: scratchCanvas.canvas,
        context: groupCtx,
        offsetX: offsetX,
        offsetY: offsetY,
        scaleX: scaleX,
        scaleY: scaleY,
        subtype: group.smask.subtype,
        backdrop: group.smask.backdrop,
        transferMap: group.smask.transferMap || null,
        startTransformInverse: null
       });
      } else
       {
        currentCtx.setTransform(1, 0, 0, 1, 0, 0);
        currentCtx.translate(offsetX, offsetY);
        currentCtx.scale(scaleX, scaleY);
       }
      copyCtxState(currentCtx, groupCtx);
      this.ctx = groupCtx;
      this.setGState([
       [
        'BM',
        'Normal'
       ],
       [
        'ca',
        1
       ],
       [
        'CA',
        1
       ]
      ]);
      this.groupStack.push(currentCtx);
      this.groupLevel++;
      this.current.activeSMask = null;
     },
     endGroup: function CanvasGraphics_endGroup(group) {
      this.groupLevel--;
      var groupCtx = this.ctx;
      this.ctx = this.groupStack.pop();
      if (this.ctx.imageSmoothingEnabled !== undefined) {
       this.ctx.imageSmoothingEnabled = false;
      } else {
       this.ctx.mozImageSmoothingEnabled = false;
      }
      if (group.smask) {
       this.tempSMask = this.smaskStack.pop();
      } else {
       this.ctx.drawImage(groupCtx.canvas, 0, 0);
      }
      this.restore();
     },
     beginAnnotations: function CanvasGraphics_beginAnnotations() {
      this.save();
      this.current = new CanvasExtraState();
      if (this.baseTransform) {
       this.ctx.setTransform.apply(this.ctx, this.baseTransform);
      }
     },
     endAnnotations: function CanvasGraphics_endAnnotations() {
      this.restore();
     },
     beginAnnotation: function CanvasGraphics_beginAnnotation(rect, transform, matrix) {
      this.save();
      if (isArray(rect) && 4 === rect.length) {
       var width = rect[2] - rect[0];
       var height = rect[3] - rect[1];
       this.ctx.rect(rect[0], rect[1], width, height);
       this.clip();
       this.endPath();
      }
      this.transform.apply(this, transform);
      this.transform.apply(this, matrix);
     },
     endAnnotation: function CanvasGraphics_endAnnotation() {
      this.restore();
     },
     paintJpegXObject: function CanvasGraphics_paintJpegXObject(objId, w, h) {
      var domImage = this.objs.get(objId);
      if (!domImage) {
       warn('Dependent image isn\'t ready yet');
       return;
      }
      this.save();
      var ctx = this.ctx;
      ctx.scale(1 / w, -1 / h);
      ctx.drawImage(domImage, 0, 0, domImage.width, domImage.height, 0, -h, w, h);
      if (this.imageLayer) {
       var currentTransform = ctx.mozCurrentTransformInverse;
       var position = this.getCanvasPosition(0, 0);
       this.imageLayer.appendImage({
        objId: objId,
        left: position[0],
        top: position[1],
        width: w / currentTransform[0],
        height: h / currentTransform[3]
       });
      }
      this.restore();
     },
     paintImageMaskXObject: function CanvasGraphics_paintImageMaskXObject(img) {
      var ctx = this.ctx;
      var width = img.width, height = img.height;
      var fillColor = this.current.fillColor;
      var isPatternFill = this.current.patternFill;
      var glyph = this.processingType3;
      if (COMPILE_TYPE3_GLYPHS && glyph && glyph.compiled === undefined) {
       if (width <= MAX_SIZE_TO_COMPILE && height <= MAX_SIZE_TO_COMPILE) {
        glyph.compiled = compileType3Glyph({
         data: img.data,
         width: width,
         height: height
        });
       } else {
        glyph.compiled = null;
       }
      }
      if (glyph && glyph.compiled) {
       glyph.compiled(ctx);
       return;
      }
      var maskCanvas = this.cachedCanvases.getCanvas('maskCanvas', width, height);
      var maskCtx = maskCanvas.context;
      maskCtx.save();
      putBinaryImageMask(maskCtx, img);
      maskCtx.globalCompositeOperation = 'source-in';
      maskCtx.fillStyle = isPatternFill ? fillColor.getPattern(maskCtx, this) : fillColor;
      maskCtx.fillRect(0, 0, width, height);
      maskCtx.restore();
      this.paintInlineImageXObject(maskCanvas.canvas);
     },
     paintImageMaskXObjectRepeat: function CanvasGraphics_paintImageMaskXObjectRepeat(imgData, scaleX, scaleY, positions) {
      var width = imgData.width;
      var height = imgData.height;
      var fillColor = this.current.fillColor;
      var isPatternFill = this.current.patternFill;
      var maskCanvas = this.cachedCanvases.getCanvas('maskCanvas', width, height);
      var maskCtx = maskCanvas.context;
      maskCtx.save();
      putBinaryImageMask(maskCtx, imgData);
      maskCtx.globalCompositeOperation = 'source-in';
      maskCtx.fillStyle = isPatternFill ? fillColor.getPattern(maskCtx, this) : fillColor;
      maskCtx.fillRect(0, 0, width, height);
      maskCtx.restore();
      var ctx = this.ctx;
      for (var i = 0, ii = positions.length; i < ii; i += 2) {
       ctx.save();
       ctx.transform(scaleX, 0, 0, scaleY, positions[i], positions[i + 1]);
       ctx.scale(1, -1);
       ctx.drawImage(maskCanvas.canvas, 0, 0, width, height, 0, -1, 1, 1);
       ctx.restore();
      }
     },
     paintImageMaskXObjectGroup: function CanvasGraphics_paintImageMaskXObjectGroup(images) {
      var ctx = this.ctx;
      var fillColor = this.current.fillColor;
      var isPatternFill = this.current.patternFill;
      for (var i = 0, ii = images.length; i < ii; i++) {
       var image = images[i];
       var width = image.width, height = image.height;
       var maskCanvas = this.cachedCanvases.getCanvas('maskCanvas', width, height);
       var maskCtx = maskCanvas.context;
       maskCtx.save();
       putBinaryImageMask(maskCtx, image);
       maskCtx.globalCompositeOperation = 'source-in';
       maskCtx.fillStyle = isPatternFill ? fillColor.getPattern(maskCtx, this) : fillColor;
       maskCtx.fillRect(0, 0, width, height);
       maskCtx.restore();
       ctx.save();
       ctx.transform.apply(ctx, image.transform);
       ctx.scale(1, -1);
       ctx.drawImage(maskCanvas.canvas, 0, 0, width, height, 0, -1, 1, 1);
       ctx.restore();
      }
     },
     paintImageXObject: function CanvasGraphics_paintImageXObject(objId) {
      var imgData = this.objs.get(objId);
      if (!imgData) {
       warn('Dependent image isn\'t ready yet');
       return;
      }
      this.paintInlineImageXObject(imgData);
     },
     paintImageXObjectRepeat: function CanvasGraphics_paintImageXObjectRepeat(objId, scaleX, scaleY, positions) {
      var imgData = this.objs.get(objId);
      if (!imgData) {
       warn('Dependent image isn\'t ready yet');
       return;
      }
      var width = imgData.width;
      var height = imgData.height;
      var map = [];
      for (var i = 0, ii = positions.length; i < ii; i += 2) {
       map.push({
        transform: [
         scaleX,
         0,
         0,
         scaleY,
         positions[i],
         positions[i + 1]
        ],
        x: 0,
        y: 0,
        w: width,
        h: height
       });
      }
      this.paintInlineImageXObjectGroup(imgData, map);
     },
     paintInlineImageXObject: function CanvasGraphics_paintInlineImageXObject(imgData) {
      var width = imgData.width;
      var height = imgData.height;
      var ctx = this.ctx;
      this.save();
      ctx.scale(1 / width, -1 / height);
      var currentTransform = ctx.mozCurrentTransformInverse;
      var a = currentTransform[0], b = currentTransform[1];
      var widthScale = Math.max(Math.sqrt(a * a + b * b), 1);
      var c = currentTransform[2], d = currentTransform[3];
      var heightScale = Math.max(Math.sqrt(c * c + d * d), 1);
      var imgToPaint, tmpCanvas;
      if (imgData instanceof HTMLElement || !imgData.data) {
       imgToPaint = imgData;
      } else {
       tmpCanvas = this.cachedCanvases.getCanvas('inlineImage', width, height);
       var tmpCtx = tmpCanvas.context;
       putBinaryImageData(tmpCtx, imgData);
       imgToPaint = tmpCanvas.canvas;
      }
      var paintWidth = width, paintHeight = height;
      var tmpCanvasId = 'prescale1';
      while (widthScale > 2 && paintWidth > 1 || heightScale > 2 && paintHeight > 1) {
       var newWidth = paintWidth, newHeight = paintHeight;
       if (widthScale > 2 && paintWidth > 1) {
        newWidth = Math.ceil(paintWidth / 2);
        widthScale /= paintWidth / newWidth;
       }
       if (heightScale > 2 && paintHeight > 1) {
        newHeight = Math.ceil(paintHeight / 2);
        heightScale /= paintHeight / newHeight;
       }
       tmpCanvas = this.cachedCanvases.getCanvas(tmpCanvasId, newWidth, newHeight);
       tmpCtx = tmpCanvas.context;
       tmpCtx.clearRect(0, 0, newWidth, newHeight);
       tmpCtx.drawImage(imgToPaint, 0, 0, paintWidth, paintHeight, 0, 0, newWidth, newHeight);
       imgToPaint = tmpCanvas.canvas;
       paintWidth = newWidth;
       paintHeight = newHeight;
       tmpCanvasId = tmpCanvasId === 'prescale1' ? 'prescale2' : 'prescale1';
      }
      ctx.drawImage(imgToPaint, 0, 0, paintWidth, paintHeight, 0, -height, width, height);
      if (this.imageLayer) {
       var position = this.getCanvasPosition(0, -height);
       this.imageLayer.appendImage({
        imgData: imgData,
        left: position[0],
        top: position[1],
        width: width / currentTransform[0],
        height: height / currentTransform[3]
       });
      }
      this.restore();
     },
     paintInlineImageXObjectGroup: function CanvasGraphics_paintInlineImageXObjectGroup(imgData, map) {
      var ctx = this.ctx;
      var w = imgData.width;
      var h = imgData.height;
      var tmpCanvas = this.cachedCanvases.getCanvas('inlineImage', w, h);
      var tmpCtx = tmpCanvas.context;
      putBinaryImageData(tmpCtx, imgData);
      for (var i = 0, ii = map.length; i < ii; i++) {
       var entry = map[i];
       ctx.save();
       ctx.transform.apply(ctx, entry.transform);
       ctx.scale(1, -1);
       ctx.drawImage(tmpCanvas.canvas, entry.x, entry.y, entry.w, entry.h, 0, -1, 1, 1);
       if (this.imageLayer) {
        var position = this.getCanvasPosition(entry.x, entry.y);
        this.imageLayer.appendImage({
         imgData: imgData,
         left: position[0],
         top: position[1],
         width: w,
         height: h
        });
       }
       ctx.restore();
      }
     },
     paintSolidColorImageMask: function CanvasGraphics_paintSolidColorImageMask() {
      this.ctx.fillRect(0, 0, 1, 1);
     },
     paintXObject: function CanvasGraphics_paintXObject() {
      warn('Unsupported \'paintXObject\' command.');
     },
     markPoint: function CanvasGraphics_markPoint(tag) {
     },
     markPointProps: function CanvasGraphics_markPointProps(tag, properties) {
     },
     beginMarkedContent: function CanvasGraphics_beginMarkedContent(tag) {
     },
     beginMarkedContentProps: function CanvasGraphics_beginMarkedContentProps(tag, properties) {
     },
     endMarkedContent: function CanvasGraphics_endMarkedContent() {
     },
     beginCompat: function CanvasGraphics_beginCompat() {
     },
     endCompat: function CanvasGraphics_endCompat() {
     },
     consumePath: function CanvasGraphics_consumePath() {
      var ctx = this.ctx;
      if (this.pendingClip) {
       if (this.pendingClip === EO_CLIP) {
        if (ctx.mozFillRule !== undefined) {
         ctx.mozFillRule = 'evenodd';
         ctx.clip();
         ctx.mozFillRule = 'nonzero';
        } else {
         ctx.clip('evenodd');
        }
       } else {
        ctx.clip();
       }
       this.pendingClip = null;
      }
      ctx.beginPath();
     },
     getSinglePixelWidth: function CanvasGraphics_getSinglePixelWidth(scale) {
      if (this.cachedGetSinglePixelWidth === null) {
       this.ctx.save();
       var inverse = this.ctx.mozCurrentTransformInverse;
       this.ctx.restore();
       this.cachedGetSinglePixelWidth = Math.sqrt(Math.max(inverse[0] * inverse[0] + inverse[1] * inverse[1], inverse[2] * inverse[2] + inverse[3] * inverse[3]));
      }
      return this.cachedGetSinglePixelWidth;
     },
     getCanvasPosition: function CanvasGraphics_getCanvasPosition(x, y) {
      var transform = this.ctx.mozCurrentTransform;
      return [
       transform[0] * x + transform[2] * y + transform[4],
       transform[1] * x + transform[3] * y + transform[5]
      ];
     }
    };
    for (var op in OPS) {
     CanvasGraphics.prototype[OPS[op]] = CanvasGraphics.prototype[op];
    }
    return CanvasGraphics;
   }();
   exports.CanvasGraphics = CanvasGraphics;
   exports.createScratchCanvas = createScratchCanvas;
  }));
  (function (root, factory) {
   factory(root.pdfjsDisplayAPI = {}, root.pdfjsSharedUtil, root.pdfjsDisplayFontLoader, root.pdfjsDisplayCanvas, root.pdfjsDisplayMetadata, root.pdfjsDisplayDOMUtils);
  }(this, function (exports, sharedUtil, displayFontLoader, displayCanvas, displayMetadata, displayDOMUtils, amdRequire) {
   var InvalidPDFException = sharedUtil.InvalidPDFException;
   var MessageHandler = sharedUtil.MessageHandler;
   var MissingPDFException = sharedUtil.MissingPDFException;
   var PageViewport = sharedUtil.PageViewport;
   var PasswordResponses = sharedUtil.PasswordResponses;
   var PasswordException = sharedUtil.PasswordException;
   var StatTimer = sharedUtil.StatTimer;
   var UnexpectedResponseException = sharedUtil.UnexpectedResponseException;
   var UnknownErrorException = sharedUtil.UnknownErrorException;
   var Util = sharedUtil.Util;
   var createPromiseCapability = sharedUtil.createPromiseCapability;
   var error = sharedUtil.error;
   var deprecated = sharedUtil.deprecated;
   var getVerbosityLevel = sharedUtil.getVerbosityLevel;
   var info = sharedUtil.info;
   var isInt = sharedUtil.isInt;
   var isArray = sharedUtil.isArray;
   var isArrayBuffer = sharedUtil.isArrayBuffer;
   var isSameOrigin = sharedUtil.isSameOrigin;
   var loadJpegStream = sharedUtil.loadJpegStream;
   var stringToBytes = sharedUtil.stringToBytes;
   var globalScope = sharedUtil.globalScope;
   var warn = sharedUtil.warn;
   var FontFaceObject = displayFontLoader.FontFaceObject;
   var FontLoader = displayFontLoader.FontLoader;
   var CanvasGraphics = displayCanvas.CanvasGraphics;
   var createScratchCanvas = displayCanvas.createScratchCanvas;
   var Metadata = displayMetadata.Metadata;
   var getDefaultSetting = displayDOMUtils.getDefaultSetting;
   var DEFAULT_RANGE_CHUNK_SIZE = 65536;
   var isWorkerDisabled = false;
   var workerSrc;
   var isPostMessageTransfersDisabled = false;
   var fakeWorkerFilesLoader = null;
   var useRequireEnsure = false;
   if (typeof window === 'undefined') {
    isWorkerDisabled = true;
    if (typeof require.ensure === 'undefined') {
     require.ensure = require('node-ensure');
    }
    useRequireEnsure = true;
   }
   if (typeof __webpack_require__ !== 'undefined') {
    useRequireEnsure = true;
   }
   if (typeof requirejs !== 'undefined' && requirejs.toUrl) {
    workerSrc = requirejs.toUrl('pdfjs-dist/build/pdf.worker.js');
   }
   var dynamicLoaderSupported = typeof requirejs !== 'undefined' && requirejs.load;
   fakeWorkerFilesLoader = useRequireEnsure ? function (callback) {
    require.ensure([], function () {
     var worker = require('./pdf.worker.js');
     callback(worker.WorkerMessageHandler);
    });
   } : dynamicLoaderSupported ? function (callback) {
    requirejs(['pdfjs-dist/build/pdf.worker'], function (worker) {
     callback(worker.WorkerMessageHandler);
    });
   } : null;
   function getDocument(src, pdfDataRangeTransport, passwordCallback, progressCallback) {
    var task = new PDFDocumentLoadingTask();
    if (arguments.length > 1) {
     deprecated('getDocument is called with pdfDataRangeTransport, ' + 'passwordCallback or progressCallback argument');
    }
    if (pdfDataRangeTransport) {
     if (!(pdfDataRangeTransport instanceof PDFDataRangeTransport)) {
      pdfDataRangeTransport = Object.create(pdfDataRangeTransport);
      pdfDataRangeTransport.length = src.length;
      pdfDataRangeTransport.initialData = src.initialData;
      if (!pdfDataRangeTransport.abort) {
       pdfDataRangeTransport.abort = function () {
       };
      }
     }
     src = Object.create(src);
     src.range = pdfDataRangeTransport;
    }
    task.onPassword = passwordCallback || null;
    task.onProgress = progressCallback || null;
    var source;
    if (typeof src === 'string') {
     source = { url: src };
    } else if (isArrayBuffer(src)) {
     source = { data: src };
    } else if (src instanceof PDFDataRangeTransport) {
     source = { range: src };
    } else {
     if (typeof src !== 'object') {
      error('Invalid parameter in getDocument, need either Uint8Array, ' + 'string or a parameter object');
     }
     if (!src.url && !src.data && !src.range) {
      error('Invalid parameter object: need either .data, .range or .url');
     }
     source = src;
    }
    var params = {};
    var rangeTransport = null;
    var worker = null;
    for (var key in source) {
     if (key === 'url' && typeof window !== 'undefined') {
      params[key] = new URL(source[key], window.location).href;
      continue;
     } else if (key === 'range') {
      rangeTransport = source[key];
      continue;
     } else if (key === 'worker') {
      worker = source[key];
      continue;
     } else if (key === 'data' && !(source[key] instanceof Uint8Array)) {
      var pdfBytes = source[key];
      if (typeof pdfBytes === 'string') {
       params[key] = stringToBytes(pdfBytes);
      } else if (typeof pdfBytes === 'object' && pdfBytes !== null && !isNaN(pdfBytes.length)) {
       params[key] = new Uint8Array(pdfBytes);
      } else if (isArrayBuffer(pdfBytes)) {
       params[key] = new Uint8Array(pdfBytes);
      } else {
       error('Invalid PDF binary data: either typed array, string or ' + 'array-like object is expected in the data property.');
      }
      continue;
     }
     params[key] = source[key];
    }
    params.rangeChunkSize = params.rangeChunkSize || DEFAULT_RANGE_CHUNK_SIZE;
    if (!worker) {
     worker = new PDFWorker();
     task._worker = worker;
    }
    var docId = task.docId;
    worker.promise.then(function () {
     if (task.destroyed) {
      throw new Error('Loading aborted');
     }
     return _fetchDocument(worker, params, rangeTransport, docId).then(function (workerId) {
      if (task.destroyed) {
       throw new Error('Loading aborted');
      }
      var messageHandler = new MessageHandler(docId, workerId, worker.port);
      var transport = new WorkerTransport(messageHandler, task, rangeTransport);
      task._transport = transport;
      messageHandler.send('Ready', null);
     });
    }).catch(task._capability.reject);
    return task;
   }
   function _fetchDocument(worker, source, pdfDataRangeTransport, docId) {
    if (worker.destroyed) {
     return Promise.reject(new Error('Worker was destroyed'));
    }
    source.disableAutoFetch = getDefaultSetting('disableAutoFetch');
    source.disableStream = getDefaultSetting('disableStream');
    source.chunkedViewerLoading = !!pdfDataRangeTransport;
    if (pdfDataRangeTransport) {
     source.length = pdfDataRangeTransport.length;
     source.initialData = pdfDataRangeTransport.initialData;
    }
    return worker.messageHandler.sendWithPromise('GetDocRequest', {
     docId: docId,
     source: source,
     disableRange: getDefaultSetting('disableRange'),
     maxImageSize: getDefaultSetting('maxImageSize'),
     cMapUrl: getDefaultSetting('cMapUrl'),
     cMapPacked: getDefaultSetting('cMapPacked'),
     disableFontFace: getDefaultSetting('disableFontFace'),
     disableCreateObjectURL: getDefaultSetting('disableCreateObjectURL'),
     postMessageTransfers: getDefaultSetting('postMessageTransfers') && !isPostMessageTransfersDisabled,
     docBaseUrl: source.docBaseUrl
    }).then(function (workerId) {
     if (worker.destroyed) {
      throw new Error('Worker was destroyed');
     }
     return workerId;
    });
   }
   var PDFDocumentLoadingTask = function PDFDocumentLoadingTaskClosure() {
    var nextDocumentId = 0;
    function PDFDocumentLoadingTask() {
     this._capability = createPromiseCapability();
     this._transport = null;
     this._worker = null;
     this.docId = 'd' + nextDocumentId++;
     this.destroyed = false;
     this.onPassword = null;
     this.onProgress = null;
     this.onUnsupportedFeature = null;
    }
    PDFDocumentLoadingTask.prototype = {
     get promise() {
      return this._capability.promise;
     },
     destroy: function () {
      this.destroyed = true;
      var transportDestroyed = !this._transport ? Promise.resolve() : this._transport.destroy();
      return transportDestroyed.then(function () {
       this._transport = null;
       if (this._worker) {
        this._worker.destroy();
        this._worker = null;
       }
      }.bind(this));
     },
     then: function PDFDocumentLoadingTask_then(onFulfilled, onRejected) {
      return this.promise.then.apply(this.promise, arguments);
     }
    };
    return PDFDocumentLoadingTask;
   }();
   var PDFDataRangeTransport = function pdfDataRangeTransportClosure() {
    function PDFDataRangeTransport(length, initialData) {
     this.length = length;
     this.initialData = initialData;
     this._rangeListeners = [];
     this._progressListeners = [];
     this._progressiveReadListeners = [];
     this._readyCapability = createPromiseCapability();
    }
    PDFDataRangeTransport.prototype = {
     addRangeListener: function PDFDataRangeTransport_addRangeListener(listener) {
      this._rangeListeners.push(listener);
     },
     addProgressListener: function PDFDataRangeTransport_addProgressListener(listener) {
      this._progressListeners.push(listener);
     },
     addProgressiveReadListener: function PDFDataRangeTransport_addProgressiveReadListener(listener) {
      this._progressiveReadListeners.push(listener);
     },
     onDataRange: function PDFDataRangeTransport_onDataRange(begin, chunk) {
      var listeners = this._rangeListeners;
      for (var i = 0, n = listeners.length; i < n; ++i) {
       listeners[i](begin, chunk);
      }
     },
     onDataProgress: function PDFDataRangeTransport_onDataProgress(loaded) {
      this._readyCapability.promise.then(function () {
       var listeners = this._progressListeners;
       for (var i = 0, n = listeners.length; i < n; ++i) {
        listeners[i](loaded);
       }
      }.bind(this));
     },
     onDataProgressiveRead: function PDFDataRangeTransport_onDataProgress(chunk) {
      this._readyCapability.promise.then(function () {
       var listeners = this._progressiveReadListeners;
       for (var i = 0, n = listeners.length; i < n; ++i) {
        listeners[i](chunk);
       }
      }.bind(this));
     },
     transportReady: function PDFDataRangeTransport_transportReady() {
      this._readyCapability.resolve();
     },
     requestDataRange: function PDFDataRangeTransport_requestDataRange(begin, end) {
      throw new Error('Abstract method PDFDataRangeTransport.requestDataRange');
     },
     abort: function PDFDataRangeTransport_abort() {
     }
    };
    return PDFDataRangeTransport;
   }();
   var PDFDocumentProxy = function PDFDocumentProxyClosure() {
    function PDFDocumentProxy(pdfInfo, transport, loadingTask) {
     this.pdfInfo = pdfInfo;
     this.transport = transport;
     this.loadingTask = loadingTask;
    }
    PDFDocumentProxy.prototype = {
     get numPages() {
      return this.pdfInfo.numPages;
     },
     get fingerprint() {
      return this.pdfInfo.fingerprint;
     },
     getPage: function PDFDocumentProxy_getPage(pageNumber) {
      return this.transport.getPage(pageNumber);
     },
     getPageIndex: function PDFDocumentProxy_getPageIndex(ref) {
      return this.transport.getPageIndex(ref);
     },
     getDestinations: function PDFDocumentProxy_getDestinations() {
      return this.transport.getDestinations();
     },
     getDestination: function PDFDocumentProxy_getDestination(id) {
      return this.transport.getDestination(id);
     },
     getPageLabels: function PDFDocumentProxy_getPageLabels() {
      return this.transport.getPageLabels();
     },
     getAttachments: function PDFDocumentProxy_getAttachments() {
      return this.transport.getAttachments();
     },
     getJavaScript: function PDFDocumentProxy_getJavaScript() {
      return this.transport.getJavaScript();
     },
     getOutline: function PDFDocumentProxy_getOutline() {
      return this.transport.getOutline();
     },
     getMetadata: function PDFDocumentProxy_getMetadata() {
      return this.transport.getMetadata();
     },
     getData: function PDFDocumentProxy_getData() {
      return this.transport.getData();
     },
     getDownloadInfo: function PDFDocumentProxy_getDownloadInfo() {
      return this.transport.downloadInfoCapability.promise;
     },
     getStats: function PDFDocumentProxy_getStats() {
      return this.transport.getStats();
     },
     cleanup: function PDFDocumentProxy_cleanup() {
      this.transport.startCleanup();
     },
     destroy: function PDFDocumentProxy_destroy() {
      return this.loadingTask.destroy();
     }
    };
    return PDFDocumentProxy;
   }();
   var PDFPageProxy = function PDFPageProxyClosure() {
    function PDFPageProxy(pageIndex, pageInfo, transport) {
     this.pageIndex = pageIndex;
     this.pageInfo = pageInfo;
     this.transport = transport;
     this.stats = new StatTimer();
     this.stats.enabled = getDefaultSetting('enableStats');
     this.commonObjs = transport.commonObjs;
     this.objs = new PDFObjects();
     this.cleanupAfterRender = false;
     this.pendingCleanup = false;
     this.intentStates = Object.create(null);
     this.destroyed = false;
    }
    PDFPageProxy.prototype = {
     get pageNumber() {
      return this.pageIndex + 1;
     },
     get rotate() {
      return this.pageInfo.rotate;
     },
     get ref() {
      return this.pageInfo.ref;
     },
     get userUnit() {
      return this.pageInfo.userUnit;
     },
     get view() {
      return this.pageInfo.view;
     },
     getViewport: function PDFPageProxy_getViewport(scale, rotate) {
      if (arguments.length < 2) {
       rotate = this.rotate;
      }
      return new PageViewport(this.view, scale, rotate, 0, 0);
     },
     getAnnotations: function PDFPageProxy_getAnnotations(params) {
      var intent = params && params.intent || null;
      if (!this.annotationsPromise || this.annotationsIntent !== intent) {
       this.annotationsPromise = this.transport.getAnnotations(this.pageIndex, intent);
       this.annotationsIntent = intent;
      }
      return this.annotationsPromise;
     },
     render: function PDFPageProxy_render(params) {
      var stats = this.stats;
      stats.time('Overall');
      this.pendingCleanup = false;
      var renderingIntent = params.intent === 'print' ? 'print' : 'display';
      var renderInteractiveForms = params.renderInteractiveForms === true ? true : false;
      if (!this.intentStates[renderingIntent]) {
       this.intentStates[renderingIntent] = Object.create(null);
      }
      var intentState = this.intentStates[renderingIntent];
      if (!intentState.displayReadyCapability) {
       intentState.receivingOperatorList = true;
       intentState.displayReadyCapability = createPromiseCapability();
       intentState.operatorList = {
        fnArray: [],
        argsArray: [],
        lastChunk: false
       };
       this.stats.time('Page Request');
       this.transport.messageHandler.send('RenderPageRequest', {
        pageIndex: this.pageNumber - 1,
        intent: renderingIntent,
        renderInteractiveForms: renderInteractiveForms
       });
      }
      var internalRenderTask = new InternalRenderTask(complete, params, this.objs, this.commonObjs, intentState.operatorList, this.pageNumber);
      internalRenderTask.useRequestAnimationFrame = renderingIntent !== 'print';
      if (!intentState.renderTasks) {
       intentState.renderTasks = [];
      }
      intentState.renderTasks.push(internalRenderTask);
      var renderTask = internalRenderTask.task;
      if (params.continueCallback) {
       deprecated('render is used with continueCallback parameter');
       renderTask.onContinue = params.continueCallback;
      }
      var self = this;
      intentState.displayReadyCapability.promise.then(function pageDisplayReadyPromise(transparency) {
       if (self.pendingCleanup) {
        complete();
        return;
       }
       stats.time('Rendering');
       internalRenderTask.initializeGraphics(transparency);
       internalRenderTask.operatorListChanged();
      }, function pageDisplayReadPromiseError(reason) {
       complete(reason);
      });
      function complete(error) {
       var i = intentState.renderTasks.indexOf(internalRenderTask);
       if (i >= 0) {
        intentState.renderTasks.splice(i, 1);
       }
       if (self.cleanupAfterRender) {
        self.pendingCleanup = true;
       }
       self._tryCleanup();
       if (error) {
        internalRenderTask.capability.reject(error);
       } else {
        internalRenderTask.capability.resolve();
       }
       stats.timeEnd('Rendering');
       stats.timeEnd('Overall');
      }
      return renderTask;
     },
     getOperatorList: function PDFPageProxy_getOperatorList() {
      function operatorListChanged() {
       if (intentState.operatorList.lastChunk) {
        intentState.opListReadCapability.resolve(intentState.operatorList);
        var i = intentState.renderTasks.indexOf(opListTask);
        if (i >= 0) {
         intentState.renderTasks.splice(i, 1);
        }
       }
      }
      var renderingIntent = 'oplist';
      if (!this.intentStates[renderingIntent]) {
       this.intentStates[renderingIntent] = Object.create(null);
      }
      var intentState = this.intentStates[renderingIntent];
      var opListTask;
      if (!intentState.opListReadCapability) {
       opListTask = {};
       opListTask.operatorListChanged = operatorListChanged;
       intentState.receivingOperatorList = true;
       intentState.opListReadCapability = createPromiseCapability();
       intentState.renderTasks = [];
       intentState.renderTasks.push(opListTask);
       intentState.operatorList = {
        fnArray: [],
        argsArray: [],
        lastChunk: false
       };
       this.transport.messageHandler.send('RenderPageRequest', {
        pageIndex: this.pageIndex,
        intent: renderingIntent
       });
      }
      return intentState.opListReadCapability.promise;
     },
     getTextContent: function PDFPageProxy_getTextContent(params) {
      return this.transport.messageHandler.sendWithPromise('GetTextContent', {
       pageIndex: this.pageNumber - 1,
       normalizeWhitespace: params && params.normalizeWhitespace === true ? true : false,
       combineTextItems: params && params.disableCombineTextItems === true ? false : true
      });
     },
     _destroy: function PDFPageProxy_destroy() {
      this.destroyed = true;
      this.transport.pageCache[this.pageIndex] = null;
      var waitOn = [];
      Object.keys(this.intentStates).forEach(function (intent) {
       if (intent === 'oplist') {
        return;
       }
       var intentState = this.intentStates[intent];
       intentState.renderTasks.forEach(function (renderTask) {
        var renderCompleted = renderTask.capability.promise.catch(function () {
        });
        waitOn.push(renderCompleted);
        renderTask.cancel();
       });
      }, this);
      this.objs.clear();
      this.annotationsPromise = null;
      this.pendingCleanup = false;
      return Promise.all(waitOn);
     },
     destroy: function () {
      deprecated('page destroy method, use cleanup() instead');
      this.cleanup();
     },
     cleanup: function PDFPageProxy_cleanup() {
      this.pendingCleanup = true;
      this._tryCleanup();
     },
     _tryCleanup: function PDFPageProxy_tryCleanup() {
      if (!this.pendingCleanup || Object.keys(this.intentStates).some(function (intent) {
        var intentState = this.intentStates[intent];
        return intentState.renderTasks.length !== 0 || intentState.receivingOperatorList;
       }, this)) {
       return;
      }
      Object.keys(this.intentStates).forEach(function (intent) {
       delete this.intentStates[intent];
      }, this);
      this.objs.clear();
      this.annotationsPromise = null;
      this.pendingCleanup = false;
     },
     _startRenderPage: function PDFPageProxy_startRenderPage(transparency, intent) {
      var intentState = this.intentStates[intent];
      if (intentState.displayReadyCapability) {
       intentState.displayReadyCapability.resolve(transparency);
      }
     },
     _renderPageChunk: function PDFPageProxy_renderPageChunk(operatorListChunk, intent) {
      var intentState = this.intentStates[intent];
      var i, ii;
      for (i = 0, ii = operatorListChunk.length; i < ii; i++) {
       intentState.operatorList.fnArray.push(operatorListChunk.fnArray[i]);
       intentState.operatorList.argsArray.push(operatorListChunk.argsArray[i]);
      }
      intentState.operatorList.lastChunk = operatorListChunk.lastChunk;
      for (i = 0; i < intentState.renderTasks.length; i++) {
       intentState.renderTasks[i].operatorListChanged();
      }
      if (operatorListChunk.lastChunk) {
       intentState.receivingOperatorList = false;
       this._tryCleanup();
      }
     }
    };
    return PDFPageProxy;
   }();
   var PDFWorker = function PDFWorkerClosure() {
    var nextFakeWorkerId = 0;
    function getWorkerSrc() {
     if (typeof workerSrc !== 'undefined') {
      return workerSrc;
     }
     if (getDefaultSetting('workerSrc')) {
      return getDefaultSetting('workerSrc');
     }
     if (pdfjsFilePath) {
      return pdfjsFilePath.replace(/\.js$/i, '.worker.js');
     }
     error('No PDFJS.workerSrc specified');
    }
    var fakeWorkerFilesLoadedCapability;
    function setupFakeWorkerGlobal() {
     var WorkerMessageHandler;
     if (fakeWorkerFilesLoadedCapability) {
      return fakeWorkerFilesLoadedCapability.promise;
     }
     fakeWorkerFilesLoadedCapability = createPromiseCapability();
     var loader = fakeWorkerFilesLoader || function (callback) {
      Util.loadScript(getWorkerSrc(), function () {
       callback(window.pdfjsDistBuildPdfWorker.WorkerMessageHandler);
      });
     };
     loader(fakeWorkerFilesLoadedCapability.resolve);
     return fakeWorkerFilesLoadedCapability.promise;
    }
    function FakeWorkerPort(defer) {
     this._listeners = [];
     this._defer = defer;
     this._deferred = Promise.resolve(undefined);
    }
    FakeWorkerPort.prototype = {
     postMessage: function (obj, transfers) {
      function cloneValue(value) {
       if (typeof value !== 'object' || value === null) {
        return value;
       }
       if (cloned.has(value)) {
        return cloned.get(value);
       }
       var result;
       var buffer;
       if ((buffer = value.buffer) && isArrayBuffer(buffer)) {
        var transferable = transfers && transfers.indexOf(buffer) >= 0;
        if (value === buffer) {
         result = value;
        } else if (transferable) {
         result = new value.constructor(buffer, value.byteOffset, value.byteLength);
        } else {
         result = new value.constructor(value);
        }
        cloned.set(value, result);
        return result;
       }
       result = isArray(value) ? [] : {};
       cloned.set(value, result);
       for (var i in value) {
        var desc, p = value;
        while (!(desc = Object.getOwnPropertyDescriptor(p, i))) {
         p = Object.getPrototypeOf(p);
        }
        if (typeof desc.value === 'undefined' || typeof desc.value === 'function') {
         continue;
        }
        result[i] = cloneValue(desc.value);
       }
       return result;
      }
      if (!this._defer) {
       this._listeners.forEach(function (listener) {
        listener.call(this, { data: obj });
       }, this);
       return;
      }
      var cloned = new WeakMap();
      var e = { data: cloneValue(obj) };
      this._deferred.then(function () {
       this._listeners.forEach(function (listener) {
        listener.call(this, e);
       }, this);
      }.bind(this));
     },
     addEventListener: function (name, listener) {
      this._listeners.push(listener);
     },
     removeEventListener: function (name, listener) {
      var i = this._listeners.indexOf(listener);
      this._listeners.splice(i, 1);
     },
     terminate: function () {
      this._listeners = [];
     }
    };
    function createCDNWrapper(url) {
     var wrapper = 'importScripts(\'' + url + '\');';
     return URL.createObjectURL(new Blob([wrapper]));
    }
    function PDFWorker(name) {
     this.name = name;
     this.destroyed = false;
     this._readyCapability = createPromiseCapability();
     this._port = null;
     this._webWorker = null;
     this._messageHandler = null;
     this._initialize();
    }
    PDFWorker.prototype = {
     get promise() {
      return this._readyCapability.promise;
     },
     get port() {
      return this._port;
     },
     get messageHandler() {
      return this._messageHandler;
     },
     _initialize: function PDFWorker_initialize() {
      if (!isWorkerDisabled && !getDefaultSetting('disableWorker') && typeof Worker !== 'undefined') {
       var workerSrc = getWorkerSrc();
       try {
        if (!isSameOrigin(window.location.href, workerSrc)) {
         workerSrc = createCDNWrapper(new URL(workerSrc, window.location).href);
        }
        var worker = new Worker(workerSrc);
        var messageHandler = new MessageHandler('main', 'worker', worker);
        var terminateEarly = function () {
         worker.removeEventListener('error', onWorkerError);
         messageHandler.destroy();
         worker.terminate();
         if (this.destroyed) {
          this._readyCapability.reject(new Error('Worker was destroyed'));
         } else {
          this._setupFakeWorker();
         }
        }.bind(this);
        var onWorkerError = function (event) {
         if (!this._webWorker) {
          terminateEarly();
         }
        }.bind(this);
        worker.addEventListener('error', onWorkerError);
        messageHandler.on('test', function PDFWorker_test(data) {
         worker.removeEventListener('error', onWorkerError);
         if (this.destroyed) {
          terminateEarly();
          return;
         }
         var supportTypedArray = data && data.supportTypedArray;
         if (supportTypedArray) {
          this._messageHandler = messageHandler;
          this._port = worker;
          this._webWorker = worker;
          if (!data.supportTransfers) {
           isPostMessageTransfersDisabled = true;
          }
          this._readyCapability.resolve();
          messageHandler.send('configure', { verbosity: getVerbosityLevel() });
         } else {
          this._setupFakeWorker();
          messageHandler.destroy();
          worker.terminate();
         }
        }.bind(this));
        messageHandler.on('console_log', function (data) {
         console.log.apply(console, data);
        });
        messageHandler.on('console_error', function (data) {
         console.error.apply(console, data);
        });
        messageHandler.on('ready', function (data) {
         worker.removeEventListener('error', onWorkerError);
         if (this.destroyed) {
          terminateEarly();
          return;
         }
         try {
          sendTest();
         } catch (e) {
          this._setupFakeWorker();
         }
        }.bind(this));
        var sendTest = function () {
         var postMessageTransfers = getDefaultSetting('postMessageTransfers') && !isPostMessageTransfersDisabled;
         var testObj = new Uint8Array([postMessageTransfers ? 255 : 0]);
         try {
          messageHandler.send('test', testObj, [testObj.buffer]);
         } catch (ex) {
          info('Cannot use postMessage transfers');
          testObj[0] = 0;
          messageHandler.send('test', testObj);
         }
        };
        sendTest();
        return;
       } catch (e) {
        info('The worker has been disabled.');
       }
      }
      this._setupFakeWorker();
     },
     _setupFakeWorker: function PDFWorker_setupFakeWorker() {
      if (!isWorkerDisabled && !getDefaultSetting('disableWorker')) {
       warn('Setting up fake worker.');
       isWorkerDisabled = true;
      }
      setupFakeWorkerGlobal().then(function (WorkerMessageHandler) {
       if (this.destroyed) {
        this._readyCapability.reject(new Error('Worker was destroyed'));
        return;
       }
       var isTypedArraysPresent = Uint8Array !== Float32Array;
       var port = new FakeWorkerPort(isTypedArraysPresent);
       this._port = port;
       var id = 'fake' + nextFakeWorkerId++;
       var workerHandler = new MessageHandler(id + '_worker', id, port);
       WorkerMessageHandler.setup(workerHandler, port);
       var messageHandler = new MessageHandler(id, id + '_worker', port);
       this._messageHandler = messageHandler;
       this._readyCapability.resolve();
      }.bind(this));
     },
     destroy: function PDFWorker_destroy() {
      this.destroyed = true;
      if (this._webWorker) {
       this._webWorker.terminate();
       this._webWorker = null;
      }
      this._port = null;
      if (this._messageHandler) {
       this._messageHandler.destroy();
       this._messageHandler = null;
      }
     }
    };
    return PDFWorker;
   }();
   var WorkerTransport = function WorkerTransportClosure() {
    function WorkerTransport(messageHandler, loadingTask, pdfDataRangeTransport) {
     this.messageHandler = messageHandler;
     this.loadingTask = loadingTask;
     this.pdfDataRangeTransport = pdfDataRangeTransport;
     this.commonObjs = new PDFObjects();
     this.fontLoader = new FontLoader(loadingTask.docId);
     this.destroyed = false;
     this.destroyCapability = null;
     this.pageCache = [];
     this.pagePromises = [];
     this.downloadInfoCapability = createPromiseCapability();
     this.setupMessageHandler();
    }
    WorkerTransport.prototype = {
     destroy: function WorkerTransport_destroy() {
      if (this.destroyCapability) {
       return this.destroyCapability.promise;
      }
      this.destroyed = true;
      this.destroyCapability = createPromiseCapability();
      var waitOn = [];
      this.pageCache.forEach(function (page) {
       if (page) {
        waitOn.push(page._destroy());
       }
      });
      this.pageCache = [];
      this.pagePromises = [];
      var self = this;
      var terminated = this.messageHandler.sendWithPromise('Terminate', null);
      waitOn.push(terminated);
      Promise.all(waitOn).then(function () {
       self.fontLoader.clear();
       if (self.pdfDataRangeTransport) {
        self.pdfDataRangeTransport.abort();
        self.pdfDataRangeTransport = null;
       }
       if (self.messageHandler) {
        self.messageHandler.destroy();
        self.messageHandler = null;
       }
       self.destroyCapability.resolve();
      }, this.destroyCapability.reject);
      return this.destroyCapability.promise;
     },
     setupMessageHandler: function WorkerTransport_setupMessageHandler() {
      var messageHandler = this.messageHandler;
      function updatePassword(password) {
       messageHandler.send('UpdatePassword', password);
      }
      var pdfDataRangeTransport = this.pdfDataRangeTransport;
      if (pdfDataRangeTransport) {
       pdfDataRangeTransport.addRangeListener(function (begin, chunk) {
        messageHandler.send('OnDataRange', {
         begin: begin,
         chunk: chunk
        });
       });
       pdfDataRangeTransport.addProgressListener(function (loaded) {
        messageHandler.send('OnDataProgress', { loaded: loaded });
       });
       pdfDataRangeTransport.addProgressiveReadListener(function (chunk) {
        messageHandler.send('OnDataRange', { chunk: chunk });
       });
       messageHandler.on('RequestDataRange', function transportDataRange(data) {
        pdfDataRangeTransport.requestDataRange(data.begin, data.end);
       }, this);
      }
      messageHandler.on('GetDoc', function transportDoc(data) {
       var pdfInfo = data.pdfInfo;
       this.numPages = data.pdfInfo.numPages;
       var loadingTask = this.loadingTask;
       var pdfDocument = new PDFDocumentProxy(pdfInfo, this, loadingTask);
       this.pdfDocument = pdfDocument;
       loadingTask._capability.resolve(pdfDocument);
      }, this);
      messageHandler.on('NeedPassword', function transportNeedPassword(exception) {
       var loadingTask = this.loadingTask;
       if (loadingTask.onPassword) {
        return loadingTask.onPassword(updatePassword, PasswordResponses.NEED_PASSWORD);
       }
       loadingTask._capability.reject(new PasswordException(exception.message, exception.code));
      }, this);
      messageHandler.on('IncorrectPassword', function transportIncorrectPassword(exception) {
       var loadingTask = this.loadingTask;
       if (loadingTask.onPassword) {
        return loadingTask.onPassword(updatePassword, PasswordResponses.INCORRECT_PASSWORD);
       }
       loadingTask._capability.reject(new PasswordException(exception.message, exception.code));
      }, this);
      messageHandler.on('InvalidPDF', function transportInvalidPDF(exception) {
       this.loadingTask._capability.reject(new InvalidPDFException(exception.message));
      }, this);
      messageHandler.on('MissingPDF', function transportMissingPDF(exception) {
       this.loadingTask._capability.reject(new MissingPDFException(exception.message));
      }, this);
      messageHandler.on('UnexpectedResponse', function transportUnexpectedResponse(exception) {
       this.loadingTask._capability.reject(new UnexpectedResponseException(exception.message, exception.status));
      }, this);
      messageHandler.on('UnknownError', function transportUnknownError(exception) {
       this.loadingTask._capability.reject(new UnknownErrorException(exception.message, exception.details));
      }, this);
      messageHandler.on('DataLoaded', function transportPage(data) {
       this.downloadInfoCapability.resolve(data);
      }, this);
      messageHandler.on('PDFManagerReady', function transportPage(data) {
       if (this.pdfDataRangeTransport) {
        this.pdfDataRangeTransport.transportReady();
       }
      }, this);
      messageHandler.on('StartRenderPage', function transportRender(data) {
       if (this.destroyed) {
        return;
       }
       var page = this.pageCache[data.pageIndex];
       page.stats.timeEnd('Page Request');
       page._startRenderPage(data.transparency, data.intent);
      }, this);
      messageHandler.on('RenderPageChunk', function transportRender(data) {
       if (this.destroyed) {
        return;
       }
       var page = this.pageCache[data.pageIndex];
       page._renderPageChunk(data.operatorList, data.intent);
      }, this);
      messageHandler.on('commonobj', function transportObj(data) {
       if (this.destroyed) {
        return;
       }
       var id = data[0];
       var type = data[1];
       if (this.commonObjs.hasData(id)) {
        return;
       }
       switch (type) {
       case 'Font':
        var exportedData = data[2];
        if ('error' in exportedData) {
         var exportedError = exportedData.error;
         warn('Error during font loading: ' + exportedError);
         this.commonObjs.resolve(id, exportedError);
         break;
        }
        var fontRegistry = null;
        if (getDefaultSetting('pdfBug') && globalScope.FontInspector && globalScope['FontInspector'].enabled) {
         fontRegistry = {
          registerFont: function (font, url) {
           globalScope['FontInspector'].fontAdded(font, url);
          }
         };
        }
        var font = new FontFaceObject(exportedData, {
         isEvalSuported: getDefaultSetting('isEvalSupported'),
         disableFontFace: getDefaultSetting('disableFontFace'),
         fontRegistry: fontRegistry
        });
        this.fontLoader.bind([font], function fontReady(fontObjs) {
         this.commonObjs.resolve(id, font);
        }.bind(this));
        break;
       case 'FontPath':
        this.commonObjs.resolve(id, data[2]);
        break;
       default:
        error('Got unknown common object type ' + type);
       }
      }, this);
      messageHandler.on('obj', function transportObj(data) {
       if (this.destroyed) {
        return;
       }
       var id = data[0];
       var pageIndex = data[1];
       var type = data[2];
       var pageProxy = this.pageCache[pageIndex];
       var imageData;
       if (pageProxy.objs.hasData(id)) {
        return;
       }
       switch (type) {
       case 'JpegStream':
        imageData = data[3];
        loadJpegStream(id, imageData, pageProxy.objs);
        break;
       case 'Image':
        imageData = data[3];
        pageProxy.objs.resolve(id, imageData);
        var MAX_IMAGE_SIZE_TO_STORE = 8000000;
        if (imageData && 'data' in imageData && imageData.data.length > MAX_IMAGE_SIZE_TO_STORE) {
         pageProxy.cleanupAfterRender = true;
        }
        break;
       default:
        error('Got unknown object type ' + type);
       }
      }, this);
      messageHandler.on('DocProgress', function transportDocProgress(data) {
       if (this.destroyed) {
        return;
       }
       var loadingTask = this.loadingTask;
       if (loadingTask.onProgress) {
        loadingTask.onProgress({
         loaded: data.loaded,
         total: data.total
        });
       }
      }, this);
      messageHandler.on('PageError', function transportError(data) {
       if (this.destroyed) {
        return;
       }
       var page = this.pageCache[data.pageNum - 1];
       var intentState = page.intentStates[data.intent];
       if (intentState.displayReadyCapability) {
        intentState.displayReadyCapability.reject(data.error);
       } else {
        error(data.error);
       }
       if (intentState.operatorList) {
        intentState.operatorList.lastChunk = true;
        for (var i = 0; i < intentState.renderTasks.length; i++) {
         intentState.renderTasks[i].operatorListChanged();
        }
       }
      }, this);
      messageHandler.on('UnsupportedFeature', function transportUnsupportedFeature(data) {
       if (this.destroyed) {
        return;
       }
       var featureId = data.featureId;
       var loadingTask = this.loadingTask;
       if (loadingTask.onUnsupportedFeature) {
        loadingTask.onUnsupportedFeature(featureId);
       }
       _UnsupportedManager.notify(featureId);
      }, this);
      messageHandler.on('JpegDecode', function (data) {
       if (this.destroyed) {
        return Promise.reject(new Error('Worker was destroyed'));
       }
       var imageUrl = data[0];
       var components = data[1];
       if (components !== 3 && components !== 1) {
        return Promise.reject(new Error('Only 3 components or 1 component can be returned'));
       }
       return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () {
         var width = img.width;
         var height = img.height;
         var size = width * height;
         var rgbaLength = size * 4;
         var buf = new Uint8Array(size * components);
         var tmpCanvas = createScratchCanvas(width, height);
         var tmpCtx = tmpCanvas.getContext('2d');
         tmpCtx.drawImage(img, 0, 0);
         var data = tmpCtx.getImageData(0, 0, width, height).data;
         var i, j;
         if (components === 3) {
          for (i = 0, j = 0; i < rgbaLength; i += 4, j += 3) {
           buf[j] = data[i];
           buf[j + 1] = data[i + 1];
           buf[j + 2] = data[i + 2];
          }
         } else if (components === 1) {
          for (i = 0, j = 0; i < rgbaLength; i += 4, j++) {
           buf[j] = data[i];
          }
         }
         resolve({
          data: buf,
          width: width,
          height: height
         });
        };
        img.onerror = function () {
         reject(new Error('JpegDecode failed to load image'));
        };
        img.src = imageUrl;
       });
      }, this);
     },
     getData: function WorkerTransport_getData() {
      return this.messageHandler.sendWithPromise('GetData', null);
     },
     getPage: function WorkerTransport_getPage(pageNumber, capability) {
      if (!isInt(pageNumber) || pageNumber <= 0 || pageNumber > this.numPages) {
       return Promise.reject(new Error('Invalid page request'));
      }
      var pageIndex = pageNumber - 1;
      if (pageIndex in this.pagePromises) {
       return this.pagePromises[pageIndex];
      }
      var promise = this.messageHandler.sendWithPromise('GetPage', { pageIndex: pageIndex }).then(function (pageInfo) {
       if (this.destroyed) {
        throw new Error('Transport destroyed');
       }
       var page = new PDFPageProxy(pageIndex, pageInfo, this);
       this.pageCache[pageIndex] = page;
       return page;
      }.bind(this));
      this.pagePromises[pageIndex] = promise;
      return promise;
     },
     getPageIndex: function WorkerTransport_getPageIndexByRef(ref) {
      return this.messageHandler.sendWithPromise('GetPageIndex', { ref: ref }).catch(function (reason) {
       return Promise.reject(new Error(reason));
      });
     },
     getAnnotations: function WorkerTransport_getAnnotations(pageIndex, intent) {
      return this.messageHandler.sendWithPromise('GetAnnotations', {
       pageIndex: pageIndex,
       intent: intent
      });
     },
     getDestinations: function WorkerTransport_getDestinations() {
      return this.messageHandler.sendWithPromise('GetDestinations', null);
     },
     getDestination: function WorkerTransport_getDestination(id) {
      return this.messageHandler.sendWithPromise('GetDestination', { id: id });
     },
     getPageLabels: function WorkerTransport_getPageLabels() {
      return this.messageHandler.sendWithPromise('GetPageLabels', null);
     },
     getAttachments: function WorkerTransport_getAttachments() {
      return this.messageHandler.sendWithPromise('GetAttachments', null);
     },
     getJavaScript: function WorkerTransport_getJavaScript() {
      return this.messageHandler.sendWithPromise('GetJavaScript', null);
     },
     getOutline: function WorkerTransport_getOutline() {
      return this.messageHandler.sendWithPromise('GetOutline', null);
     },
     getMetadata: function WorkerTransport_getMetadata() {
      return this.messageHandler.sendWithPromise('GetMetadata', null).then(function transportMetadata(results) {
       return {
        info: results[0],
        metadata: results[1] ? new Metadata(results[1]) : null
       };
      });
     },
     getStats: function WorkerTransport_getStats() {
      return this.messageHandler.sendWithPromise('GetStats', null);
     },
     startCleanup: function WorkerTransport_startCleanup() {
      this.messageHandler.sendWithPromise('Cleanup', null).then(function endCleanup() {
       for (var i = 0, ii = this.pageCache.length; i < ii; i++) {
        var page = this.pageCache[i];
        if (page) {
         page.cleanup();
        }
       }
       this.commonObjs.clear();
       this.fontLoader.clear();
      }.bind(this));
     }
    };
    return WorkerTransport;
   }();
   var PDFObjects = function PDFObjectsClosure() {
    function PDFObjects() {
     this.objs = Object.create(null);
    }
    PDFObjects.prototype = {
     ensureObj: function PDFObjects_ensureObj(objId) {
      if (this.objs[objId]) {
       return this.objs[objId];
      }
      var obj = {
       capability: createPromiseCapability(),
       data: null,
       resolved: false
      };
      this.objs[objId] = obj;
      return obj;
     },
     get: function PDFObjects_get(objId, callback) {
      if (callback) {
       this.ensureObj(objId).capability.promise.then(callback);
       return null;
      }
      var obj = this.objs[objId];
      if (!obj || !obj.resolved) {
       error('Requesting object that isn\'t resolved yet ' + objId);
      }
      return obj.data;
     },
     resolve: function PDFObjects_resolve(objId, data) {
      var obj = this.ensureObj(objId);
      obj.resolved = true;
      obj.data = data;
      obj.capability.resolve(data);
     },
     isResolved: function PDFObjects_isResolved(objId) {
      var objs = this.objs;
      if (!objs[objId]) {
       return false;
      } else {
       return objs[objId].resolved;
      }
     },
     hasData: function PDFObjects_hasData(objId) {
      return this.isResolved(objId);
     },
     getData: function PDFObjects_getData(objId) {
      var objs = this.objs;
      if (!objs[objId] || !objs[objId].resolved) {
       return null;
      } else {
       return objs[objId].data;
      }
     },
     clear: function PDFObjects_clear() {
      this.objs = Object.create(null);
     }
    };
    return PDFObjects;
   }();
   var RenderTask = function RenderTaskClosure() {
    function RenderTask(internalRenderTask) {
     this._internalRenderTask = internalRenderTask;
     this.onContinue = null;
    }
    RenderTask.prototype = {
     get promise() {
      return this._internalRenderTask.capability.promise;
     },
     cancel: function RenderTask_cancel() {
      this._internalRenderTask.cancel();
     },
     then: function RenderTask_then(onFulfilled, onRejected) {
      return this.promise.then.apply(this.promise, arguments);
     }
    };
    return RenderTask;
   }();
   var InternalRenderTask = function InternalRenderTaskClosure() {
    function InternalRenderTask(callback, params, objs, commonObjs, operatorList, pageNumber) {
     this.callback = callback;
     this.params = params;
     this.objs = objs;
     this.commonObjs = commonObjs;
     this.operatorListIdx = null;
     this.operatorList = operatorList;
     this.pageNumber = pageNumber;
     this.running = false;
     this.graphicsReadyCallback = null;
     this.graphicsReady = false;
     this.useRequestAnimationFrame = false;
     this.cancelled = false;
     this.capability = createPromiseCapability();
     this.task = new RenderTask(this);
     this._continueBound = this._continue.bind(this);
     this._scheduleNextBound = this._scheduleNext.bind(this);
     this._nextBound = this._next.bind(this);
    }
    InternalRenderTask.prototype = {
     initializeGraphics: function InternalRenderTask_initializeGraphics(transparency) {
      if (this.cancelled) {
       return;
      }
      if (getDefaultSetting('pdfBug') && globalScope.StepperManager && globalScope.StepperManager.enabled) {
       this.stepper = globalScope.StepperManager.create(this.pageNumber - 1);
       this.stepper.init(this.operatorList);
       this.stepper.nextBreakPoint = this.stepper.getNextBreakPoint();
      }
      var params = this.params;
      this.gfx = new CanvasGraphics(params.canvasContext, this.commonObjs, this.objs, params.imageLayer);
      this.gfx.beginDrawing(params.transform, params.viewport, transparency);
      this.operatorListIdx = 0;
      this.graphicsReady = true;
      if (this.graphicsReadyCallback) {
       this.graphicsReadyCallback();
      }
     },
     cancel: function InternalRenderTask_cancel() {
      this.running = false;
      this.cancelled = true;
      this.callback('cancelled');
     },
     operatorListChanged: function InternalRenderTask_operatorListChanged() {
      if (!this.graphicsReady) {
       if (!this.graphicsReadyCallback) {
        this.graphicsReadyCallback = this._continueBound;
       }
       return;
      }
      if (this.stepper) {
       this.stepper.updateOperatorList(this.operatorList);
      }
      if (this.running) {
       return;
      }
      this._continue();
     },
     _continue: function InternalRenderTask__continue() {
      this.running = true;
      if (this.cancelled) {
       return;
      }
      if (this.task.onContinue) {
       this.task.onContinue.call(this.task, this._scheduleNextBound);
      } else {
       this._scheduleNext();
      }
     },
     _scheduleNext: function InternalRenderTask__scheduleNext() {
      if (this.useRequestAnimationFrame && typeof window !== 'undefined') {
       window.requestAnimationFrame(this._nextBound);
      } else {
       Promise.resolve(undefined).then(this._nextBound);
      }
     },
     _next: function InternalRenderTask__next() {
      if (this.cancelled) {
       return;
      }
      this.operatorListIdx = this.gfx.executeOperatorList(this.operatorList, this.operatorListIdx, this._continueBound, this.stepper);
      if (this.operatorListIdx === this.operatorList.argsArray.length) {
       this.running = false;
       if (this.operatorList.lastChunk) {
        this.gfx.endDrawing();
        this.callback();
       }
      }
     }
    };
    return InternalRenderTask;
   }();
   var _UnsupportedManager = function UnsupportedManagerClosure() {
    var listeners = [];
    return {
     listen: function (cb) {
      deprecated('Global UnsupportedManager.listen is used: ' + ' use PDFDocumentLoadingTask.onUnsupportedFeature instead');
      listeners.push(cb);
     },
     notify: function (featureId) {
      for (var i = 0, ii = listeners.length; i < ii; i++) {
       listeners[i](featureId);
      }
     }
    };
   }();
   if (typeof pdfjsVersion !== 'undefined') {
    exports.version = pdfjsVersion;
   }
   if (typeof pdfjsBuild !== 'undefined') {
    exports.build = pdfjsBuild;
   }
   exports.getDocument = getDocument;
   exports.PDFDataRangeTransport = PDFDataRangeTransport;
   exports.PDFWorker = PDFWorker;
   exports.PDFDocumentProxy = PDFDocumentProxy;
   exports.PDFPageProxy = PDFPageProxy;
   exports._UnsupportedManager = _UnsupportedManager;
  }));
  (function (root, factory) {
   factory(root.pdfjsDisplayGlobal = {}, root.pdfjsSharedUtil, root.pdfjsDisplayDOMUtils, root.pdfjsDisplayAPI, root.pdfjsDisplayAnnotationLayer, root.pdfjsDisplayTextLayer, root.pdfjsDisplayMetadata, root.pdfjsDisplaySVG, root.pdfjsDisplayForms);
  }(this, function (exports, sharedUtil, displayDOMUtils, displayAPI, displayAnnotationLayer, displayTextLayer, displayMetadata, displaySVG, displayForms) {
   var globalScope = sharedUtil.globalScope;
   var deprecated = sharedUtil.deprecated;
   var warn = sharedUtil.warn;
   var LinkTarget = displayDOMUtils.LinkTarget;
   var isWorker = typeof window === 'undefined';
   if (!globalScope.PDFJS) {
    globalScope.PDFJS = {};
   }
   var PDFJS = globalScope.PDFJS;
   if (typeof pdfjsVersion !== 'undefined') {
    PDFJS.version = pdfjsVersion;
   }
   if (typeof pdfjsBuild !== 'undefined') {
    PDFJS.build = pdfjsBuild;
   }
   PDFJS.pdfBug = false;
   if (PDFJS.verbosity !== undefined) {
    sharedUtil.setVerbosityLevel(PDFJS.verbosity);
   }
   delete PDFJS.verbosity;
   Object.defineProperty(PDFJS, 'verbosity', {
    get: function () {
     return sharedUtil.getVerbosityLevel();
    },
    set: function (level) {
     sharedUtil.setVerbosityLevel(level);
    },
    enumerable: true,
    configurable: true
   });
   PDFJS.VERBOSITY_LEVELS = sharedUtil.VERBOSITY_LEVELS;
   PDFJS.OPS = sharedUtil.OPS;
   PDFJS.UNSUPPORTED_FEATURES = sharedUtil.UNSUPPORTED_FEATURES;
   PDFJS.isValidUrl = displayDOMUtils.isValidUrl;
   PDFJS.shadow = sharedUtil.shadow;
   PDFJS.createBlob = sharedUtil.createBlob;
   PDFJS.createObjectURL = function PDFJS_createObjectURL(data, contentType) {
    return sharedUtil.createObjectURL(data, contentType, PDFJS.disableCreateObjectURL);
   };
   Object.defineProperty(PDFJS, 'isLittleEndian', {
    configurable: true,
    get: function PDFJS_isLittleEndian() {
     var value = sharedUtil.isLittleEndian();
     return sharedUtil.shadow(PDFJS, 'isLittleEndian', value);
    }
   });
   PDFJS.removeNullCharacters = sharedUtil.removeNullCharacters;
   PDFJS.PasswordResponses = sharedUtil.PasswordResponses;
   PDFJS.PasswordException = sharedUtil.PasswordException;
   PDFJS.UnknownErrorException = sharedUtil.UnknownErrorException;
   PDFJS.InvalidPDFException = sharedUtil.InvalidPDFException;
   PDFJS.MissingPDFException = sharedUtil.MissingPDFException;
   PDFJS.UnexpectedResponseException = sharedUtil.UnexpectedResponseException;
   PDFJS.Util = sharedUtil.Util;
   PDFJS.PageViewport = sharedUtil.PageViewport;
   PDFJS.createPromiseCapability = sharedUtil.createPromiseCapability;
   PDFJS.maxImageSize = PDFJS.maxImageSize === undefined ? -1 : PDFJS.maxImageSize;
   PDFJS.cMapUrl = PDFJS.cMapUrl === undefined ? null : PDFJS.cMapUrl;
   PDFJS.cMapPacked = PDFJS.cMapPacked === undefined ? false : PDFJS.cMapPacked;
   PDFJS.disableFontFace = PDFJS.disableFontFace === undefined ? false : PDFJS.disableFontFace;
   PDFJS.imageResourcesPath = PDFJS.imageResourcesPath === undefined ? '' : PDFJS.imageResourcesPath;
   PDFJS.disableWorker = PDFJS.disableWorker === undefined ? false : PDFJS.disableWorker;
   PDFJS.workerSrc = PDFJS.workerSrc === undefined ? null : PDFJS.workerSrc;
   PDFJS.disableRange = PDFJS.disableRange === undefined ? false : PDFJS.disableRange;
   PDFJS.disableStream = PDFJS.disableStream === undefined ? false : PDFJS.disableStream;
   PDFJS.disableAutoFetch = PDFJS.disableAutoFetch === undefined ? false : PDFJS.disableAutoFetch;
   PDFJS.pdfBug = PDFJS.pdfBug === undefined ? false : PDFJS.pdfBug;
   PDFJS.postMessageTransfers = PDFJS.postMessageTransfers === undefined ? true : PDFJS.postMessageTransfers;
   PDFJS.disableCreateObjectURL = PDFJS.disableCreateObjectURL === undefined ? false : PDFJS.disableCreateObjectURL;
   PDFJS.disableWebGL = PDFJS.disableWebGL === undefined ? true : PDFJS.disableWebGL;
   PDFJS.externalLinkTarget = PDFJS.externalLinkTarget === undefined ? LinkTarget.NONE : PDFJS.externalLinkTarget;
   PDFJS.externalLinkRel = PDFJS.externalLinkRel === undefined ? 'noreferrer' : PDFJS.externalLinkRel;
   PDFJS.isEvalSupported = PDFJS.isEvalSupported === undefined ? true : PDFJS.isEvalSupported;
   var savedOpenExternalLinksInNewWindow = PDFJS.openExternalLinksInNewWindow;
   delete PDFJS.openExternalLinksInNewWindow;
   Object.defineProperty(PDFJS, 'openExternalLinksInNewWindow', {
    get: function () {
     return PDFJS.externalLinkTarget === LinkTarget.BLANK;
    },
    set: function (value) {
     if (value) {
      deprecated('PDFJS.openExternalLinksInNewWindow, please use ' + '"PDFJS.externalLinkTarget = PDFJS.LinkTarget.BLANK" instead.');
     }
     if (PDFJS.externalLinkTarget !== LinkTarget.NONE) {
      warn('PDFJS.externalLinkTarget is already initialized');
      return;
     }
     PDFJS.externalLinkTarget = value ? LinkTarget.BLANK : LinkTarget.NONE;
    },
    enumerable: true,
    configurable: true
   });
   if (savedOpenExternalLinksInNewWindow) {
    PDFJS.openExternalLinksInNewWindow = savedOpenExternalLinksInNewWindow;
   }
   PDFJS.getDocument = displayAPI.getDocument;
   PDFJS.PDFDataRangeTransport = displayAPI.PDFDataRangeTransport;
   PDFJS.PDFWorker = displayAPI.PDFWorker;
   Object.defineProperty(PDFJS, 'hasCanvasTypedArrays', {
    configurable: true,
    get: function PDFJS_hasCanvasTypedArrays() {
     var value = displayDOMUtils.hasCanvasTypedArrays();
     return sharedUtil.shadow(PDFJS, 'hasCanvasTypedArrays', value);
    }
   });
   PDFJS.CustomStyle = displayDOMUtils.CustomStyle;
   PDFJS.LinkTarget = LinkTarget;
   PDFJS.addLinkAttributes = displayDOMUtils.addLinkAttributes;
   PDFJS.getFilenameFromUrl = displayDOMUtils.getFilenameFromUrl;
   PDFJS.isExternalLinkTargetSet = displayDOMUtils.isExternalLinkTargetSet;
   PDFJS.AnnotationLayer = displayAnnotationLayer.AnnotationLayer;
   PDFJS.renderTextLayer = displayTextLayer.renderTextLayer;
   PDFJS.Metadata = displayMetadata.Metadata;
   PDFJS.SVGGraphics = displaySVG.SVGGraphics;
   PDFJS.FormFunctionality = displayForms.FormFunctionality;
   PDFJS.UnsupportedManager = displayAPI._UnsupportedManager;
   exports.globalScope = globalScope;
   exports.isWorker = isWorker;
   exports.PDFJS = globalScope.PDFJS;
  }));
 }.call(pdfjsLibs));
 exports.PDFJS = pdfjsLibs.pdfjsDisplayGlobal.PDFJS;
 exports.build = pdfjsLibs.pdfjsDisplayAPI.build;
 exports.version = pdfjsLibs.pdfjsDisplayAPI.version;
 exports.getDocument = pdfjsLibs.pdfjsDisplayAPI.getDocument;
 exports.PDFDataRangeTransport = pdfjsLibs.pdfjsDisplayAPI.PDFDataRangeTransport;
 exports.PDFWorker = pdfjsLibs.pdfjsDisplayAPI.PDFWorker;
 exports.renderTextLayer = pdfjsLibs.pdfjsDisplayTextLayer.renderTextLayer;
 exports.AnnotationLayer = pdfjsLibs.pdfjsDisplayAnnotationLayer.AnnotationLayer;
 exports.CustomStyle = pdfjsLibs.pdfjsDisplayDOMUtils.CustomStyle;
 exports.PasswordResponses = pdfjsLibs.pdfjsSharedUtil.PasswordResponses;
 exports.InvalidPDFException = pdfjsLibs.pdfjsSharedUtil.InvalidPDFException;
 exports.MissingPDFException = pdfjsLibs.pdfjsSharedUtil.MissingPDFException;
 exports.SVGGraphics = pdfjsLibs.pdfjsDisplaySVG.SVGGraphics;
 exports.UnexpectedResponseException = pdfjsLibs.pdfjsSharedUtil.UnexpectedResponseException;
 exports.OPS = pdfjsLibs.pdfjsSharedUtil.OPS;
 exports.UNSUPPORTED_FEATURES = pdfjsLibs.pdfjsSharedUtil.UNSUPPORTED_FEATURES;
 exports.isValidUrl = pdfjsLibs.pdfjsDisplayDOMUtils.isValidUrl;
 exports.createValidAbsoluteUrl = pdfjsLibs.pdfjsSharedUtil.createValidAbsoluteUrl;
 exports.createObjectURL = pdfjsLibs.pdfjsSharedUtil.createObjectURL;
 exports.removeNullCharacters = pdfjsLibs.pdfjsSharedUtil.removeNullCharacters;
 exports.shadow = pdfjsLibs.pdfjsSharedUtil.shadow;
 exports.createBlob = pdfjsLibs.pdfjsSharedUtil.createBlob;
 exports.getFilenameFromUrl = pdfjsLibs.pdfjsDisplayDOMUtils.getFilenameFromUrl;
 exports.addLinkAttributes = pdfjsLibs.pdfjsDisplayDOMUtils.addLinkAttributes;
}));