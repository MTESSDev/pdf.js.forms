# PDF.js / pdf.js.forms 

[PDF.js](https://mozilla.github.io/pdf.js/) is a Portable Document Format (PDF) viewer that is built with HTML5.
pdf.js.forms is a fork of [PDF.js](https://github.com/mozilla/pdf.js). 
The original purpose of this fork was to implement fillable
web forms of pdf.forms using PDF.js. Since the original inception of this fork,
pdj.js has evolved and now loosely supports rendering forms, however their implementation
is still not really workable for business/production use so continued maintenance 
of this library will occur. 

There is a distribution package of this should you wish to use it:

**pdf-forms-dist**
[![GitHub package.json version](https://img.shields.io/github/package-json/v/mainegreen/pdfjs-forms-dist.svg?style=flat-square)](https://github.com/mainegreen/pdfjs-forms-dist)
[![npm](https://img.shields.io/npm/v/pdfjs-forms-dist.svg?style=flat-square)](https://www.npmjs.com/package/pdfjs-forms-dist)

The PDF.js has two builds that are needed to utilize the forms library: generic and
components. Both must be built and included to use pdf.js.forms. This fork 
* adds code to core/annotations.js to introduce groupingName and fullName 
* replaces display/annotation_layer with annotation_layer_forms in pdf.js
* introduces web/forms, which handles all form rendering and management
* replaces web/pdf_viewer.css with pdf_forms.css

To utilize this library you must bundle with your application the files in build\generic\build and
build\components. If not packing using webpack or some alternative you must serve the following files:
* build\generic\components\pdf_forms.css
* build\generic\components\pdf_viewer.js
* build\generic\build\pdf.js

Be sure to include build\generic\build\pdf.worker.js in the same directory as pdf.js or specify it's 
location like so
   
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'some/path/pdf.worker.js';

**Note: Changes since previous release**

The 'PDFJS' global accessor is dead. PDF.js now lives in 'pdfjsLib'. If you have a lot of code and 
refactoring is not your thing I suppose you could do something like

    let PDFJS = pdfjsLib;

That might work.

The 'returnFormElementsOnPage' is now asynchronous, and results must be worked with as with all
promises: in a then() block. This is because page.getAnnotations is now truly async, and not just
fake async in the base library. 

FormFunctionality used to live in the core pdf.js library, but has been moved out to the compentents
library. This was to simplify using the components viewer code as well as well as to simplify using 
with webpack in other projects.

### TO USE FORMS:
To render a form use the PDFJS.FormFunctionality.render call. A width or height can
be specified, if both are specified this creates a bounding box that the pdf will fit
inside of.

    let target = document.getElementById('target');
    pdf.getPage(1).then(function(page) {
        pdfjsViewer.FormFunctionality.render(800,800,page,target);
    });

Either of the first two size parameters may be set to either a number, or false, but at
least one must be specified. If only one is specified, the other parameter will be treated
as unlimited. An example where we want a maximum width of 800, but don't care how tall

    pdfjsViewer.FormFunctionality.render(800,false,page,target);
    
The values in the form elements may be overriden at render time by passing in an object
with alternate values.

    let values = {'ADDR1': '21 Jump Street', 'CITY': 'San Marino'};
    pdfjsViewer.FormFunctionality.render(800,800,page,target,values);

A page may be rendered without rendering the form at all, or you can render the form non-interactively,
aka draw it, which is the normal pdf.js method.

To render the pdf and hide the form entirely call render with the options argument like so:

    pdfjsViewer.FormFunctionality.render(800,800,page,target,values, {hideForms: true});
    
To render the pdf with forms non-interactively call the render with the options argument like so:

    pdfjsViewer.FormFunctionality.render(800,800,page,target,values, {interactiveForms: false});

The values in the form may be retrieved manually of course outside of the pdf.js.forms library,
but there is also a call to simplify retrieval of those values. The function will return an
array of values of the form elements in format \[elementId\]=value.

    let values = pdfjsViewer.FormFunctionality.getFormValues();

The forms library also allows the rendering of a particular element (as defined by id) or of
a class of elements to be handled by a closure, or function. For example, to have all
text elements rendered by closure, and not by the base library.

    let myClosure = function(TextAnnotationElement) {
        control = document.createElement('input');
        // set some stuff
        return control;
    };
    pdfjsViewer.FormFunctionality.setControlRenderClosureByType(myClosure,'TEXT');

Alternately, you may accept the base default rendering of the control element, but instead opt to modify the control
element after the default control element object has been created, but before it has been inserted into the dom.

    let myClosure = function (fieldType, elementId, element) {
        if (fieldType!='PAGE' && fieldType!='CANVAS' && fieldType!='FORM') {
            element.style = element.style + '; background-color:orange;';
        }
    };
    pdfjsViewer.FormFunctionality.setPostCreationTweak(myClosure);

The basic types are:
+ CHECK_BOX - Check boxes - Maps to CheckboxWidgetAnnotationElement
+ TEXT - All _input_ controls of type text, file and password as well as _textarea_s - Maps to TextAnnotationElement
+ DROP_DOWN - Regular drop downs and multiselects - Maps to ChoiceWidgetAnnotationElement
+ RADIO_BUTTON - Radio buttons - Maps to RadioButtonWidgetAnnotationElement

Depending on the source element type, the properties that define the element can vary. Each element
will be one of four annotation widget types, as defined in the annotation_layer_forms file. Exploration of
these widgets can help you code your own renderers if you wish.

#### Simple example

    window.onload = function () {
        let DEFAULT_URL = 'pdfs/jax9.pdf';
        let pageNumber = 1;
        let container = document.getElementById('pdfTarget');
        let values = {
            'txtSimple': 'This is a simple value',
            'txtRequired': 'This is required',
            'Group5': 'Choice1',
        };
        // Fetch the PDF document from the URL using promises.
        let loadingTask = pdfjsViewer.getDocument(DEFAULT_URL);
        loadingTask.promise.then(function(doc) {
            return doc.getPage(pageNumber).then(function (pdfPage) {
                return pdfjsViewer.FormFunctionality.render(1094, null, pdfPage, container, values);
            });
        });
    }

## Notes
+ Since the form elements are basic html elements, the library does not provide any simplification
of access to the html form elements, such as value setting functions on the fly. The only exceptions
to this are that the default values may be passed on render, and the values may be retrieved en masse
using the getFormValues() function.

+ When defining your own closures to handle rendering, note that you do not need to position the element yourself.
Each element when returned from the closure will then be placed in a positional element that itself will ensure the
elements placement on the pdf.

+ PDFs that have form elements with repeated names will render all but the first as read-only. This would occur in
scenarios where a value is repeated on the form, such as 'legal name', especially in legal documents. getFormValues()
will return only the unlocked/primary element's value, and not the others. If you wish to have editing of the primary
immediately reflected on other elements of the page, you would need to set a watch, and update the others when the
primary is updated. The attributes on the html elements, data-group and data-group-slave, can help you set up the 
appropriate listeners and update methods relatively easily.

## Gotchas

There is an issue with Chrome's handling of css scaling and matrixes that will render drop down's choices 
in the wrong size. This is a fundamental flaw in Chrome. 


## >> END FORMS SPECIFIC README <<
## >> BEGIN BASIC PDF.JS README <<
PDF.js is a Portable Document Format (PDF) viewer that is built with HTML5.

PDF.js is community-driven and supported by Mozilla Labs. Our goal is to
create a general-purpose, web standards-based platform for parsing and
rendering PDFs.

## Contributing

PDF.js is an open source project and always looking for more contributors. To
get involved, visit:

+ [Issue Reporting Guide](https://github.com/mozilla/pdf.js/blob/master/.github/CONTRIBUTING.md)
+ [Code Contribution Guide](https://github.com/mozilla/pdf.js/wiki/Contributing)
+ [Frequently Asked Questions](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions)
+ [Good Beginner Bugs](https://github.com/mozilla/pdf.js/issues?direction=desc&labels=5-good-beginner-bug&page=1&sort=created&state=open)
+ [Projects](https://github.com/mozilla/pdf.js/projects)

Feel free to stop by #pdfjs on irc.mozilla.org for questions or guidance.

## Getting Started

### Online demo

+ https://mozilla.github.io/pdf.js/web/viewer.html

### Browser Extensions

#### Firefox

PDF.js is built into version 19+ of Firefox.

#### Chrome

+ The official extension for Chrome can be installed from the [Chrome Web Store](https://chrome.google.com/webstore/detail/pdf-viewer/oemmndcbldboiebfnladdacbdfmadadm).
*This extension is maintained by [@Rob--W](https://github.com/Rob--W).*
+ Build Your Own - Get the code as explained below and issue `gulp chromium`. Then open
Chrome, go to `Tools > Extension` and load the (unpackaged) extension from the
directory `build/chromium`.

## Getting the Code

To get a local copy of the current code, clone it using git:

    git clone https://github.com/mozilla/pdf.js.git
    cd pdf.js

Next, install Node.js via the [official package](https://nodejs.org) or via
[nvm](https://github.com/creationix/nvm). You need to install the gulp package
globally (see also [gulp's getting started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started)):

    npm install -g gulp-cli

If everything worked out, install all dependencies for PDF.js:

    npm install

Finally, you need to start a local web server as some browsers do not allow opening
PDF files using a `file://` URL. Run:

    gulp server

and then you can open:

+ http://localhost:8888/web/viewer.html

Please keep in mind that this requires an ES6 compatible browser; refer to [Building PDF.js](https://github.com/mozilla/pdf.js/blob/master/README.md#building-pdfjs) for usage with older browsers.

It is also possible to view all test PDF files on the right side by opening:

+ http://localhost:8888/test/pdfs/?frame

## Building PDF.js

In order to bundle all `src/` files into two production scripts and build the generic
viewer, run:

    gulp generic

This will generate `pdf.js` and `pdf.worker.js` in the `build/generic/build/` directory.
Both scripts are needed but only `pdf.js` needs to be included since `pdf.worker.js` will
be loaded by `pdf.js`. The PDF.js files are large and should be minified for production.

## Using PDF.js in a web application

To use PDF.js in a web application you can choose to use a pre-built version of the library
or to build it from source. We supply pre-built versions for usage with NPM and Bower under
the `pdfjs-dist` name. For more information and examples please refer to the
[wiki page](https://github.com/mozilla/pdf.js/wiki/Setup-pdf.js-in-a-website) on this subject.

## Including via a CDN

PDF.js is hosted on several free CDNs:
 - https://www.jsdelivr.com/package/npm/pdfjs-dist
 - https://cdnjs.com/libraries/pdf.js
 - https://unpkg.com/pdfjs-dist/

## Learning

You can play with the PDF.js API directly from your browser using the live demos below:

+ [Interactive examples](https://mozilla.github.io/pdf.js/examples/index.html#interactive-examples)

More examples can be found in the [examples folder](https://github.com/mozilla/pdf.js/tree/master/examples/). Some of them are using the pdfjs-dist package, which can be built and installed in this repo directory via `gulp dist-install` command.

For an introduction to the PDF.js code, check out the presentation by our
contributor Julian Viereck:

+ https://www.youtube.com/watch?v=Iv15UY-4Fg8

More learning resources can be found at:

+ https://github.com/mozilla/pdf.js/wiki/Additional-Learning-Resources

The API documentation can be found at:

+ https://mozilla.github.io/pdf.js/api/

## Questions

Check out our FAQs and get answers to common questions:

+ https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions

Talk to us on IRC (Internet Relay Chat):

+ #pdfjs on irc.mozilla.org

File an issue:

+ https://github.com/mozilla/pdf.js/issues/new

Follow us on twitter: @pdfjs

+ https://twitter.com/pdfjs
