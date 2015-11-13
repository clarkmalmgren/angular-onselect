# Angular On Select Directive

[![license:mit](https://img.shields.io/badge/license-mit-green.svg)]()
[![Travis](https://img.shields.io/travis/clarkmalmgren/angular-onselect.svg)]()
[![Coveralls](https://img.shields.io/coveralls/clarkmalmgren/angular-onselect.svg)]()
[![npm](https://img.shields.io/npm/dt/angular-onselect.svg)]()
[![npm](https://img.shields.io/npm/v/angular-onselect.svg)]()
[![Bower](https://img.shields.io/bower/v/angular-onselect.svg)]()

Directive that allows for click-and-drag or just a click for highlighting words within any container
regardless of type. The `on-select` attribute value is evaluated whenever a word or a group of words
have been highlighted. The selection object is passed in as `selection` in the evaluated component.

Additionally, if `auto-highlight` is also present, upon selection the selected text is automatically
highlighted. This is * effectively the same as calling `selection.highlight(..)` with some basic
defaults.

If `snap-to-word` is present, the selected text is expanded to include whole words (including punctuation).
If snap-to-word is turned on, simply clicking on a word is the same as highlighting the whole word.

## Example Usage

The below example shows how to use `on-select` to automatically highlight a word and then after `2000ms` the highlight
is removed. This is a running demo [here](http://clarkmalmgren.github.io/angular-onselect/).

```javascript
angular.module('example', ['onSelect'])
  .controller('ExampleController', function() {
    var vm = this;
    vm.handler = handler;
    return this;

    function handler(selection) {
      setTimeout(function() {
        selection.removeHighlight();
      }, 2000);
    };
  });
```

```html
<div ng-controller="ExampleController as vm">
  <div on-select="vm.handler(selection);" auto-highlight snap-to-word>
    Bacon ipsum dolor amet ut beef ribs culpa...
  </div>
</div>
```

## Installation

```bash
$ npm install --save angular-onselect

   -- or --

$ bower install --save angular-onselect
```

## Submitting Issues

Please file a github issue for any problems or feature requests.

## Contributing

See [Contributing](CONTRIBUTING.md)

## License

[Licensed under MIT](LICENSE)