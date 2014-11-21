var {Cc, Ci} = require('chrome');
var DOMUtils = Cc["@mozilla.org/inspector/dom-utils;1"].getService(Ci.inIDOMUtils);

var toArray = function (arrayish) {
  return [].slice.call(arrayish);
};

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

var isVisible = function (elem) {
  if (!elem || elem === elem.ownerDocument.documentElement) {
    return true;
  }

  var utils = require('sdk/window/utils');
  var active = utils.getMostRecentBrowserWindow();
  var window = active.content;

  var style = window.getComputedStyle(elem);
  var parent = elem.parentNode;
  return style.display !== 'none'
    && style.visibility !== 'hidden'
    && parseFloat(style.opacity) !== 0
    && isVisible(elem.parentNode);
};
exports.isVisible = isVisible;

var ignoreTags = {
  'SCRIPT': true,
  'NOSCRIPT': true,
  'STYLE': true,
  'IFRAME': true,
  'OPTION': true
};
var isRealText = function (node) {
  var parent = node.parentNode;
  return isTextNode(node) && isVisible(parent) && !ignoreTags[parent.tagName];
};
exports.isRealText = isRealText;

exports.getFonts = function (node) {
    if (!DOMUtils) {
        return [];
    }

    var range = node.ownerDocument.createRange();
    try {
        range.selectNode(node);
    } catch (err) {
        // TODO: error handling
    }

    var fontFaces = DOMUtils.getUsedFontFaces(range);
    var fonts = [];
    for (var i=0; i < fontFaces.length; i++) {
        fonts.push(fontFaces.item(i));
    }

    return fonts;
};

exports.getDocument = function (node) {
    if (node && node.ownerDocument) {
        return node.ownerDocument;
    }

    var utils = require('sdk/window/utils');
    var active = utils.getMostRecentBrowserWindow();
    return active.content.document;
};
