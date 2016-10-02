'use strict'

var murl = require('murl')

var Patterns = module.exports = function (patterns) {
  if (!(this instanceof Patterns)) return new Patterns(patterns)

  this._patterns = (patterns || []).map(function (ptn) {
    return [compile(ptn), ptn, undefined]
  })
}

var compile = function (ptn) {
  if (typeof ptn === 'string') return murl(ptn)
  return function (target) {
    return target.match(ptn)
  }
}

Patterns.prototype.add = function (ptn, val) {
  this._patterns.push([compile(ptn), ptn, val])
}

Patterns.prototype.match = function (target, index) {
  var self = this
  var next = function () {
    return self.match(target, index + 1)
  }
  var ptn, match
  if (!index) index = 0
  for (var l = this._patterns.length; index < l; index++) {
    ptn = this._patterns[index]
    match = ptn[0](target)
    if (match) {
      return {
        target: target,
        pattern: ptn[1],
        params: match,
        value: ptn[2],
        next: next
      }
    }
  }
  return null
}

Patterns.prototype.matchAll = function (target) {
  var matches = []
  var ptn, match
  for (var i = 0; i < this._patterns.length; i++) {
    ptn = this._patterns[i]
    match = ptn[0](target)
    if (match) {
      matches.push({
        target: target,
        pattern: ptn[1],
        params: match,
        value: ptn[2]
      })
    }
  }

  return matches
}
