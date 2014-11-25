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

  // heuristic approach
  var isVisible = function (elem) {
    if (!elem || elem === document.documentElement) {
      return true;
    }

    var style = window.getComputedStyle(elem);
    var parent = elem.parentNode;
    return style.display !== 'none'
      && style.visibility !== 'hidden'
      && parseFloat(style.opacity) !== 0
      && !(parseFloat(style.textIndent) < -100)
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

  var hasClass = function (elem, clazz) {
    var className = ' ' + elem.className + ' ';
    return className.indexOf(' ' + clazz + ' ') !== -1;
  };

  var addClass = function (elem, clazz) {
    if (elem.classList) {
      elem.classList.add(clazz);
    } else if (!hasClass(elem, clazz)) {
      elem.className = trim(elem.className + ' ' + clazz);
    }
  };

  var removeClass = function (elem, clazz) {
    if (elem.classList) {
      elem.classList.remove(clazz);
    } else {
      elem.className = compact((' ' + elem.className + ' ').replace(new RegExp('\\s' + clazz + '\\s', 'g'), ''));
    }
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

  var matches = function (elem, selector) {
    var m = (elem.document || elem.ownerDocument).querySelectorAll(selector);
    var i = 0;

    while (m[i] && m[i] !== elem) {
      i++;
    }

    return !!m[i];
  };

  var getEvent = function (e) {
    return e || window.event;
  };

  var getTarget = function (e) {
    e = e || getEvent(e);
    return e.target || e.sourceElement;
  };

  var stopPropagation = function (e) {
    e = e || getEvent(e);
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    else {
      e.cancelBubble = true;
    }
  };

  /**
   * All prepared, let's get started
   */

  // Use this to store result
  var weightMap = {};
  var elemMap = {};
  var maxSize = 36;
  var minSize = 18;
  var id = 'fi-report';
  var highlightedClass = 'fi-highlighted';
  var collapsedClass = 'fi-collapsed';

  var calculate = function () {

    // cleanup
    weightMap = {};

    walk(document.body, function (n) {
      if (!isRealText(n)) {
        return;
      }

      var text = compact(n.nodeValue);
      var count = text.replace(/[\s\r\n]+/g, '').length;
      if (!count) {
        return;
      }

      var family = window.getComputedStyle(n.parentNode).fontFamily;

      if (!weightMap.hasOwnProperty(family)) {
        weightMap[family] = 0;
        elemMap[family] = n.parentNode;
      }

      weightMap[family] += count;
    }, function (n) {
      return n.id !== id;
    });

    var rank = [];
    for (var family in weightMap) {
      if (weightMap[family] === 0) {
        continue;
      }
      rank.push({
        family: family,
        count: weightMap[family],
        weight: Math.log(weightMap[family])
      });
    }

    rank.sort(function (a, b) {
      return b.weight - a.weight;
    });

    return rank;
  };

  var report;
  var list;
{{#firefox}}
  var usedList;
{{/firefox}}

  var show = function (rank) {
    if (!rank.length) {
      return;
    }

    var max = rank[0].weight;
    var min = rank[rank.length - 1].weight;

    var html = rank.map(function (item) {
      var size = rank.length === 1
        ? maxSize
        : (item.weight - min) / (max - min) * (maxSize - minSize) + minSize;
      var code = [
        '<li style="font-family: ' + escape(item.family) + '; font-size: ' + size + 'px;" title="' + escape(item.family) + '" data-family="' + escape(item.family) + '">',
          escape(item.family) + '<span class="fi-count" title="' + item.count + ' glyph' + (item.count > 1 ? 's' : '') + '">' + item.count + '</span>',
        '</li>'
        ].join('');
      return code;
    });

    report = document.getElementById(id);
    if (!report) {
      report = document.createElement('aside');
      report.id = id;

      list = document.createElement('ol');
      list.className = 'fi-computed-list';
      report.appendChild(list);
{{#firefox}}
      usedList = document.createElement('ol');
      usedList.className = 'fi-used-list';
      report.appendChild(usedList);

      var switcher = document.createElement('span');
      switcher.className = 'fi-switcher';
      report.insertBefore(switcher, list);

      var computed = {
        className: 'fi-computed',
        hint: 'Switch to actual (rendered) font families',
        title: 'Might be quite slow on pages with lots of text.'
      };

      var used = {
        className: 'fi-used',
        hint: 'Switch to computed font families',
        title: ''
      };

      function update(data) {
        hint.innerHTML = data.hint;
        hint.title = data.title;
        report.className = data.className;
      }

      var hint = document.createElement('span');
      hint.className = 'fi-switcher-hint';
      update(computed);
      switcher.appendChild(hint);

      var proceed = document.createElement('button');
      proceed.innerHTML = 'Go';
      proceed.className = 'fi-proceed';
      switcher.appendChild(proceed);

      proceed.onclick = function () {
        if (report.className === used.className) {
          show(calculate());
          update(computed);
        } else {
          self.port.emit('check-used');
          update(used);
        }
      };
{{/firefox}}
      var expand = document.createElement('button');
      expand.className = 'fi-expand';
      expand.innerHTML = 'fi';
      report.appendChild(expand);

      var close = document.createElement('button');
      close.className = 'fi-close';
      close.innerHTML = '×';
      report.appendChild(close);
      close.onclick = function () {
        removeNode(report);
      };

      var link = document.createElement('a');
      link.className = 'fi-link';
      link.href = 'http://justineo.github.io/fi/';
      link.innerHTML = 'Powered by <strong>fi</strong>';
      report.appendChild(link);

      var style = '{{{style}}}';
      createStyle(style, report);

      document.body.appendChild(report);

      report.onclick = function (e) {
        var target = getTarget(e);

        // expand
        removeClass(report, collapsedClass);

        // remove highlighted
        var highlighted = document.body.querySelector('.' + highlightedClass);
        highlighted && removeClass(highlighted, highlightedClass);

        // click on sigle family, highlight the first matched element
        if (matches(target, '#' + id + ' .fi-computed-list li, #' + id + ' .fi-computed-list li *')) {
          while(!matches(target, '#' + id + ' .fi-computed-list li')) {
            target = target.parentNode;
          }

          var family = target.getAttribute('data-family');
          var elem = elemMap[family];
          if (elem) {
            elem.scrollIntoView();
            addClass(elem, highlightedClass);
            addClass(report, collapsedClass);
          }
        }
        stopPropagation(e);
      };
    }
{{#firefox}}
    if (report.className === 'fi-used') {
      usedList.innerHTML = html.join('');
    } else {
      list.innerHTML = html.join('');
    }
{{/firefox}}
{{^firefox}}
    list.innerHTML = html.join('');
{{/firefox}}
  };

  show(calculate());

  {{#firefox}}
  self.port.on('used-checked', function (data) {
    show(JSON.parse(data));
  });
  {{/firefox}}

  return false;
})();
