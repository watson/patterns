# match-patterns

Match a string against a list of patterns.

[![build status](https://secure.travis-ci.org/watson/match-patterns.png)](http://travis-ci.org/watson/match-patterns)

## Installation

```
npm install match-patterns
```

## Example usage

Even though this module is a generic pattern matcher, it's well suited
for HTTP route matching:

```js
var http = require('http');
var patterns = require('match-patterns')();

patterns.add('GET /foo', fn1);
patterns.add('GET /foo/{id}', fn2);
patterns.add('POST /foo/{id}', fn3);

http.createServer(function (req, res) {
  var match = patterns.match(req.method + ' ' + req.url);

  if (!match) {
    req.writeHead(404);
    req.end();
    return;
  }

  var fn = match.value;
  req.params = match.params;

  fn(req, res);
}).listen(8080);
```

## API

### `patterns.add(pattern[, value])`

Arguments:

- `pattern` - The pattern as either a string or a RegExp object
- `value` (optional) - Returned as part of the match object when calling
  the `.match()` method. Can be of any type

If the `pattern` is a string it will be matched using the
[murl](https://github.com/mafintosh/murl) module. If the `pattern` is a
RegExp object it will be matched as is.

### `patterns.match(target)`

Arguments:

- `target` - The string that should be matched against each pattern

Runs through each pattern in order and returns a match object for the
first match. If no pattern matches `null` is returned.

#### Example match object

```js
{
  pattern: 'GET /foo/{id}', // the matched pattern (1st argument to `.add()` function)
  target: 'GET /foo/bar',   // the target string
  params: {                 // the named parameters from the pattern
    id: '...'
  },
  value: callback,          // the value (2nd argument to `.add()` function)
  next: fn                  // function to skip this match and continue
}
```

Note that if the pattern is a RegExp object, `params` will be the result
of the native `<str>.match(<ptn>)` function (an array).

## License

MIT
