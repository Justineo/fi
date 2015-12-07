var {Cc, Ci} = require('chrome');
var DOMUtils = Cc["@mozilla.org/inspector/dom-utils;1"].getService(Ci.inIDOMUtils);

var toArray = function (arrayish) {
  return [].slice.call(arrayish);
};

var utils = require('sdk/window/utils');
var getWindow = function () {
    var active = utils.getMostRecentBrowserWindow();
    return active.content;
};
exports.getWindow = getWindow;

var getDocument = function (node) {
    if (node && node.ownerDocument) {
        return node.ownerDocument;
    }

    return getWindow().document;
};
exports.getDocument = getDocument;

var walk = function (node, callback, filter) {
  if (typeof filter === 'function' && !filter(node)) {
    return;
  }

  if (node.childNodes.length) {
    var childNodes = toArray(node.childNodes);
    for (var i = 0, j = childNodes.length; i < j; i++) {
      walk(childNodes[i], callback, filter);
    }
  }

  if (typeof callback === 'function') {
    callback(node);
  }
};
exports.walk = walk;

var isTextNode = function (node) {
  return node.nodeType === 3;
};
exports.isTextNode = isTextNode;

// heuristic approach to detect actual visibility of an element
var elemCache = [];
var indexCache = {};

var isVisible = function (elem) {
  if (!elem || elem === getDocument(elem)) {
    return true;
  }

  var i;
  if ((i = elemCache.indexOf(elem)) !== -1) {
    return indexCache[i];
  }

  var style = getWindow().getComputedStyle(elem);
  var parent = elem.parentNode;
  var result = style.display !== 'none' // totally none
    && style.visibility !== 'hidden' // hidden
    && parseFloat(style.opacity) !== 0 // transparent
    && parseFloat(style.textIndent) > -512 && style.textIndent !== '100%' // usual image replace method: -9999px, -9999em, 100%
    && (parseFloat(style.width) * parseFloat(style.height) > 1 || style.overflow === 'visible') // hide but accessible through screen readers
    && !/rect\(1px(?:(?:,\s*|\s+)1px){3}\)/.test(style.clip) // hide text using clip: rect(1px, 1px, 1px, 1px)
    && isVisible(elem.parentNode);

  indexCache[elemCache.length] = result;
  elemCache.push(elem);

  return result;
};
exports.isVisible = isVisible;

var ignoreTags = {
  'SCRIPT': true,
  'NOSCRIPT': true,
  'STYLE': true,
  'IFRAME': true,
  'OPTION': true
};
var isVisibleText = function (node) {
  var parent = node.parentNode;
  var fontSize = parseFloat(getWindow().getComputedStyle(parent).fontSize);
  return isTextNode(node) && isVisible(parent) && fontSize > 0 && !ignoreTags[parent.tagName];
};
exports.isVisibleText = isVisibleText;

var getFonts = function (range) {
    if (!DOMUtils) {
        console.log('No DOMUtils');
        return [];
    }

    var fontFaces = DOMUtils.getUsedFontFaces(range);
    var fonts = [];
    for (var i=0; i < fontFaces.length; i++) {
        fonts.push(fontFaces.item(i));
    }

    return fonts;
};
exports.getFonts = getFonts;
