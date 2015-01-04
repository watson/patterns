'use strict';

var murl = require('murl');

var Patterns = module.exports = function (patterns) {
  if (!(this instanceof Patterns))
    return new Patterns(patterns);
  this._patterns = patterns || [];
};

Patterns.prototype.add = function (ptn, val) {
  this._patterns.push([ptn, val]);
};

Patterns.prototype.match = function (target, index) {
  var self = this;
  var next = function () {
    return self.match(target, index+1);
  };
  var ptn, match;
  if (!index) index = 0;
  for (var l = this._patterns.length; index < l; index++) {
    ptn = this._patterns[index][0];
    match = typeof ptn === 'string' ? murl(ptn)(target) : target.match(ptn);
    if (match) return {
      target: target,
      pattern: ptn,
      params: match,
      value: this._patterns[index][1],
      next: next
    };
  }
  return null;
};
