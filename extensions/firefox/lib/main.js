var {Cc, Ci} = require('chrome');
var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var self = require('sdk/self');
var fi2 = require('fi2');

var button = buttons.ActionButton({
  id: 'fi-link',
  label: 'Activate fi',
  icon: {
    '16': './128.png',
    '32': './128.png',
    '64': './128.png'
  },
  onClick: function () {
    var worker = tabs.activeTab.attach({
      contentScriptFile: self.data.url('./fi.min.js')
    });

    worker.port.on('check-used', function () {
      var rank = fi2.calculate();
      worker.port.emit('used-checked', JSON.stringify(rank));
    });
  }
});
