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

  // heuristic approach to detect actual visibility of an element
  var elemCache = [];
  var indexCache = {};

  var isVisible = function (elem) {
    if (!elem || elem === document.documentElement) {
      return true;
    }

    var i;
    if ((i = elemCache.indexOf(elem)) !== -1) {
      return indexCache[i];
    }

    var style = window.getComputedStyle(elem);
    var parent = elem.parentNode;
    var result = style.display !== 'none' // totally none
      && style.visibility !== 'hidden' // hidden
      && parseFloat(style.opacity) !== 0 // transparent
      && parseFloat(style.textIndent) > -512 && style.textIndent !== '100%' // usual image replace method: -9999px, -9999em, 100%
      && (parseFloat(style.width) * parseFloat(style.height) > 1 || style.overflow === 'visible') // hide but accessible through screen readers
      && parseFloat(style.fontSize) > 0 // can't see texts
      && !/rect\(1px(?:(?:,\s*|\s+)1px){3}\)/.test(style.clip) // hide text using clip: rect(1px, 1px, 1px, 1px)
      && isVisible(elem.parentNode);

    indexCache[elemCache.length] = result;
    elemCache.push(elem);

    return result;
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
    elemMap = {};

    walk(document.body, function (n) {
      if (!isRealText(n)) {
        return;
      }

      var text = compact(n.nodeValue);
      var count = text.replace(/[\s\r\n]+/g, '').length;
      if (!count) {
        return;
      }

      var parent = n.parentNode;
      var family = window.getComputedStyle(parent).fontFamily;

      if (!weightMap.hasOwnProperty(family)) {
        weightMap[family] = 0;
        elemMap[family] = [];
      }

      weightMap[family] += count;

      var elemList = elemMap[family];
      var last = elemList[elemList.length - 1];
      // push in three cases in order to prevent duplication
      // 1. empty list
      // 2. already in the list
      // 3. following the last added node in document order
      if (!last || last === parent || last.compareDocumentPosition(parent) & 4) { // Node.DOCUMENT_POSITION_FOLLOWING === 2
        elemList.push(parent);
      }
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
        hint: 'Showing computed font families',
        title: 'Click “switch” to see used (rendered) font families'
      };

      var used = {
        className: 'fi-used',
        hint: 'Showing used (rendered) font families',
        title: 'Click “switch” to see computed font families'
      };

      function updateHint(data) {
        hint.textContent = data.hint;
        hint.title = data.title;
        report.className = data.className;
      }

      var hint = document.createElement('span');
      hint.className = 'fi-switcher-hint';
      updateHint(computed);
      switcher.appendChild(hint);

      var proceed = document.createElement('button');
      proceed.textContent = 'Switch';
      proceed.className = 'fi-proceed';
      switcher.appendChild(proceed);

      proceed.onclick = function () {
        if (report.className === used.className) {
          show(calculate());
          updateHint(computed);
        } else {
          self.port.emit('check-used');
          updateHint(used);
        }
      };
{{/firefox}}
      var expand = document.createElement('button');
      expand.className = 'fi-expand';
      expand.textContent = 'fi';
      report.appendChild(expand);
      expand.onclick = function () {
        // expand
        removeClass(report, collapsedClass);
        unhighlight();
      }

      var close = document.createElement('button');
      close.className = 'fi-close';
      close.textContent = '×';
      report.appendChild(close);
      close.onclick = destroy;

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

        // remove highlighted
        var highlighted = document.body.querySelector('.' + highlightedClass);
        highlighted && removeClass(highlighted, highlightedClass);

        // click on sigle family, highlight the first matched element
        if (matches(target, '#' + id + ' .fi-computed-list li, #' + id + ' .fi-computed-list li *')) {
          while(!matches(target, '#' + id + ' .fi-computed-list li')) {
            target = target.parentNode;
          }

          var family = target.getAttribute('data-family');
          var elemList = elemMap[family];
          if (elemList) {
            for (var i = 0, j = elemList.length; i < j; i++) {
              var elem = elemList[i];
              // elem.scrollIntoView();
              addClass(elem, highlightedClass);
              addClass(report, collapsedClass);
            }
          }
        }
        stopPropagation(e);
      };
    }

    var max = rank[0].weight;
    var min = rank[rank.length - 1].weight;
    var output;
{{#firefox}}
    var isUsed = report.className === 'fi-used';
    if (isUsed) {
      output = usedList;
    } else {
      output = list;
    }
{{/firefox}}{{^firefox}}
    output = list;
{{/firefox}}
    output.innerHTML = '';
    rank.forEach(function (item) {
      var size = rank.length === 1
        ? maxSize
        : (item.weight - min) / (max - min) * (maxSize - minSize) + minSize;
      var li = document.createElement('li');
{{#firefox}}
      var family = item.family;
      if (isUsed) {
        family = '"' + family + '"';
      }
      li.style.cssText = 'font-family: ' + family + '; font-size: ' + size + 'px;';
{{/firefox}}{{^firefox}}
      li.style.cssText = 'font-family: ' + item.family + '; font-size: ' + size + 'px;';
{{/firefox}}
      li.setAttribute('data-family', item.family);
      li.title = item.family;
      li.textContent = item.family;

      var count = document.createElement('span');
      count.className = 'fi-count';
      count.title = item.count + ' glyph' + (item.count > 1 ? 's' : '');
      count.textContent = item.count;

      li.appendChild(count);
      output.appendChild(li);
    });
  };

  var destroy = function () {
    removeNode(report);
    unhighlight();
  };

  var unhighlight = function () {
    var highlighted = toArray(document.querySelectorAll('.' + highlightedClass));

    for (var i = 0, j = highlighted.length; i < j; i++) {
      removeClass(highlighted[i], highlightedClass);
    }
  };

  show(calculate());

  {{#firefox}}
  self.port.on('used-checked', function (data) {
    show(JSON.parse(data));
  });
  {{/firefox}}

  return false;
})();
