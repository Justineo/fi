var dom = require('dom');

var id = 'fi-report';

exports.calculate = function () {
  var document = dom.getDocument();

  // Use this to store result
  var weightMap = {};
  var maxSize = 36;
  var minSize = 18;
  var range = document.createRange();
  dom.walk(document.body, function (n) {
    if (!dom.isRealText(n)) {
      return;
    }

    var text = n.nodeValue;
    if (!text.length) {
      return;
    }

    // iterate glyphs one by one
    for (var i = 0; i < text.length; i++) {
      range.setStart(n, i);
      range.setEnd(n, i + 1);

      // skip white spaces
      if (range.toString().match(/\s/)) {
        continue;
      }

      var font = dom.getFonts(range)[0];
      if (!font) {
        return;
      }
      var family = font.CSSFamilyName;
      if (!weightMap.hasOwnProperty(family)) {
        weightMap[family] = 0;
      }
      weightMap[family]++;
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
