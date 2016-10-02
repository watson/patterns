'use strict'

var test = require('tape')
var murl = require('murl')
var Patterns = require('./')

test('no patterns', function (t) {
  var p = Patterns()
  var match = p.match('foo')
  t.equal(match, null)
  t.end()
})

test('string patterns', function (t) {
  var p = Patterns()
  p.add('foo', 1)
  p.add('bar', 2)
  p.add('baz', 3)
  var match = p.match('bar')
  t.equal(match.target, 'bar')
  t.equal(match.pattern, 'bar')
  t.deepEqual(match.params, murl('bar')('bar'))
  t.equal(match.value, 2)
  t.ok(typeof match.next, 'function')
  t.end()
})

test('murl patterns', function (t) {
  var p = Patterns()
  p.add('/{hello}/{world}?')
  var match = p.match('/foo/bar')
  t.deepEqual(match.params, { hello: 'foo', world: 'bar' })
  match = p.match('/foo')
  t.deepEqual(match.params, { hello: 'foo', world: undefined })
  t.end()
})

test('RegExp patterns', function (t) {
  var p = Patterns()
  p.add(/foo/, 1)
  p.add(/bar/, 2)
  p.add(/baz/, 3)
  var match = p.match('bar')
  t.equal(match.target, 'bar')
  t.deepEqual(match.pattern, /bar/)
  t.deepEqual(match.params, 'bar'.match(/bar/))
  t.equal(match.value, 2)
  t.ok(typeof match.next, 'function')
  t.end()
})

test('next function', function (t) {
  var p = Patterns()
  p.add(/foo/, 1)
  p.add(/bar/, 2)
  p.add(/baz/, 3)
  var match = p.match('foobar')
  t.equal(match.value, 1)
  match = match.next()
  t.equal(match.value, 2)
  match = match.next()
  t.equal(match, null)
  t.end()
})

test('last next function', function (t) {
  var p = Patterns()
  p.add(/foo/, 1)
  var match = p.match('foo')
  t.equal(match.value, 1)
  match = match.next()
  t.equal(match, null)
  t.end()
})

test('matchAll', function (t) {
  var p = Patterns()
  p.add(/foo/, 1)
  p.add(/foo/, 2)
  p.add(/foo/, 3)
  var matches = p.matchAll('foo')
  t.equal(matches[0].value, 1)
  t.equal(matches[1].value, 2)
  t.equal(matches[2].value, 3)
  t.end()
})

