# patterns

Match a string against a list of patterns.

[![build status](https://secure.travis-ci.org/watson/patterns.png)](http://travis-ci.org/watson/patterns)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

*The name of this module was previosuly `match-patterns`, but [Pavel
Lang](https://github.com/langpavel) have been generous to give me the
`patterns` name on NPM. If you are looking for the previous module it
have been renamed
[design-patterns](https://www.npmjs.com/package/design-patterns).*

## Installation

```
npm install patterns
```

## Example usage

Add patterns using the `.add()` function:

```js
var patterns = require('patterns')()

patterns.add('mathias', 'foo') // a pattern can be a string
patterns.add(/(tom|thomas)/, 'bar') // or a RegExp object
patterns.add('anders', 'baz')

var match = patterns.match('thomas')

if (match) console.log(match.value) // outputs 'bar'
```

The module can also be seeded with an array of patterns if you don't
care about a 2nd argument that you can supply to the `.add()` function:

```js
var patterns = require('patterns')([
  /foo/,
  /bar/,
  /baz/
])

if (patterns.match('foobar')) {
  console.log('success!')
}
```

## API

### `patterns.add(pattern[, value])`

Arguments:

- `pattern` - The pattern as either a string or a RegExp object
- `value` (optional) - Returned as part of the match object when calling
  the `.match()` function. Can be of any type

If the `pattern` is a string it will be matched using the
[murl](https://github.com/mafintosh/murl) module. If the `pattern` is a
RegExp object it will be matched as is.

### `patterns.match(target)`

Arguments:

- `target` - The string that should be matched against each pattern

Runs through each pattern in order and returns a match object for the
first match. If no pattern matches `null` is returned.

### `patterns.matchAll(target)`

Arguments

- `target` - The string that should be matched against each pattern

Runs through each pattern in order and returns an array of match objects.
If no pattern matches, an empty array is returned.

#### Example match object

```js
{
  pattern: '/Users/{name}', // the matched pattern (1st argument to `.add()` function)
  target: '/Users/watson',  // the target string
  params: {                 // the named parameters from the pattern
    name: 'watson'
  },
  value: value,             // the value (2nd argument to `.add()` function)
  next: function () {...}   // function to skip this match and continue
}
```

Note that if the pattern is a RegExp object, `params` will be the result
of the native `<str>.match(<ptn>)` function (an array).

#### The next-function

The `match.next` function can be used to skip the found match and
continue matching the string against the patterns:

```js
patterns.add(/foo/, 1)
patterns.add(/baz/, 2)
patterns.add(/bar/, 3)

var values = []

var match = patterns.match('foobar')
while (match) {
  values.push(match.value)
  match = match.next()
}

console.log(values) // [1, 3]
```

## Example: A complete HTTP router

In this example the patterns module is used as a simple but powerful
HTTP route matcher:

```js
var http = require('http')
var url = require('url')
var patterns = require('patterns')()

patterns.add('GET /foo', fn1)
patterns.add('GET /foo/{id}', fn2)
patterns.add('POST /foo/{id}', fn3)

http.createServer(function (req, res) {
  var path = url.parse(req.url).pathname
  var match = patterns.match(req.method + ' ' + path)

  if (!match) {
    res.writeHead(404)
    res.end()
    return
  }

  var fn = match.value // expects the value to be a function
  req.params = match.params

  fn(req, res)
}).listen(8080)
```

## License

MIT
