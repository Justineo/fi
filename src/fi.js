(function () {

  /**
   * Common utilities
   */

  var toArray = function (arrayish) {
    return [].slice.call(arrayish);
  };

  var trim = function (s) {
    return s.replace(/^\s+|\s+$/g, '');
  };

  var collapse = function (s) {
    return s.replace(/\s+/g, ' ');
  };

  var compact = function (s) {
    return collapse(trim(s));
  };

  var idCounter = 0x1024;
  var guid = function () {
    return idCounter++;
  };

  /**
   * DOM utilities
   */

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

  var isTextNode = function (node) {
    return node.nodeType === Node.TEXT_NODE;
  };

  var isVisible = function (elem) {
    if (!elem || elem === document.documentElement) {
      return true;
    }

    var style = window.getComputedStyle(elem);
    var parent = elem.parentNode;
    return style.display !== 'none'
      && style.visibility !== 'hidden'
      && parseFloat(style.opacity) !== 0
      && isVisible(elem.parentNode);
  };

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

  // `escape` borrowed from underscore
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  var keys = function (obj) {
    if (Object.keys) {
      return Object.keys(obj);
    }

    var result = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return result;
  };

  var escape = function (string) {
    var escaper = function (match) {
      return escapeMap[match];
    };

    var source = '(?:' + keys(escapeMap).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');

    string = string == null ? '' : '' + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };

  function createStyle(styleText, context) {
      var style = document.createElement('style');
      style.type = 'text/css';

      // <style> element must be appended into DOM before setting `cssText`
      // otherwise IE8 will interpret the text in IE7 mode.
      context = context || document.body;
      context.appendChild(style);
      if (style.styleSheet) {
          style.styleSheet.cssText = styleText;
      } else {
          style.appendChild(document.createTextNode(styleText));
      }
  }

  var removeNode = function (node) {
    if (node) {
      node.parentNode.removeChild(node);
    }
  };

  /**
   * All prepared, let's get started
   */

  // Use this to store result
  var familyMap = {};
  var maxSize = 48;
  var minSize = 16;

  var calculate = function () {

    // cleanup
    familyMap = {};

    walk(document.body, function (n) {
      if (!isRealText(n) || n === report) {
        return;
      }

      var text = compact(n.nodeValue);
      var count = text.length;
      if (!count) {
        return;
      }

      var family = window.getComputedStyle(n.parentNode).fontFamily;

      if (!familyMap.hasOwnProperty(family)) {
        familyMap[family] = 0;
      }

      familyMap[family] += count;
    });

    var rank = [];
    for (var family in familyMap) {
      if (familyMap[family] === 0) {
        continue;
      }
      rank.push({
        family: family,
        count: familyMap[family],
        weight: Math.log(familyMap[family])
      });
    }

    rank.sort(function (a, b) {
      return b.weight - a.weight;
    });

    return rank;
  };

  var id = 'fi-report';
  var report;
  var list;

  var show = function (rank) {
    var max = rank[0].weight;
    var min = rank[rank.length - 1].weight;

    var html = rank.map(function (item) {
      var size = rank.length === 1
        ? maxSize
        : (item.weight - min) / (max - min) * (maxSize - minSize) + minSize;
      var code = [
        '<li style="font-family: ' + escape(item.family) + '; font-size: ' + size + 'px;" title="' + escape(item.family) + '">',
          escape(item.family) + ' (' + item.count + ')',
        '</li>'
        ].join('');
      return code;
    });

    report = document.getElementById(id);
    if (!report) {
      report = document.createElement('aside');
      report.id = id;
      report.title = 'Click to close';

      list = document.createElement('ol');
      report.appendChild(list);

      var style = [
        '#' + id + ' {',
          'overflow: auto;',
          'position: fixed;',
          'top: 0;',
          'left: 0;',
          'width: 100%;',
          'height: 100%;',
          'margin: 0;',
          'padding: 15px 20px;',
          'background-color: rgba(0, 0, 0, 0.7);',
          'z-index: 2147483647;',
        '}',
        '#' + id + ' li {',
          'margin: 0;',
          'padding: 0;',
          'list-style: none;',
          'line-height: 1.5;',
          'color: #fff;',
          'text-shadow: 1px 1px 0 #000;',
          'text-align: left;',
        '}'
      ].join('\n');
      createStyle(style, report);

      document.body.appendChild(report);
    }

    list = report.firstChild;
    list.innerHTML = html.join('');
    report.onclick = function () {
      removeNode(this);
    };
  }

  show(calculate());

  return false;
})();
