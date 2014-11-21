var dom = require('dom');

var id = 'fi-report';

exports.calculate = function () {
  var document = dom.getDocument();

  // Use this to store result
  var weightMap = {};
  var maxSize = 36;
  var minSize = 18;
  var fontStat = [];

  dom.walk(document.body, function (n) {
    if (!dom.isRealText(n)) {
      return;
    }

    var text = n.nodeValue;
    if (!text.length) {
      return;
    }

    // iterate glyphs one by one
    var glyphs = text
      .split('')
      .filter(function (glyph) {
        return !glyph.match(/\s/);
      })
      .map(function (glyph) {
        return document.createTextNode(glyph);
      });
    glyphs.forEach(function (glyph) {
      n.parentNode.insertBefore(glyph, n);
      var font = dom.getFonts(glyph)[0];
      if (!font) {
        return;
      }
      var family = font.CSSFamilyName;
      if (!weightMap.hasOwnProperty(family)) {
        weightMap[family] = 0;
      }
      weightMap[family]++;
      n.parentNode.removeChild(glyph);
    });
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
