(function() {

  angular.module('onSelect')
    .directive('onSelect', OnSelectDirective);

  /**
   * @ngdoc directive
   * @name onSelect
   * @restrict A
   * @ngInject
   *
   * @description
   * Directive that allows for click-and-drag or just a click for highlighting words within any container
   * regardless of type. The `on-select` attribute value is evaluated whenever a word or a group of words
   * have been highlighted. The selection object is passed in as `selection` in the evaluated component.
   *
   * Additionally, if `auto-highlight` is also present, upon selection the selected text is automatically
   * highlighted. This is * effectively the same as calling `selection.highlight(..)` with some basic
   * defaults.
   *
   * If `snap-to-word` is present, the selected text is expanded to include whole words (including punctuation).
   * If snap-to-word is turned on, simply clicking on a word is the same as highlighting the whole word.
   *
   * @example
      <example module="example">
        <file name="script.js">
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
        </file>
        <file name="index.html">
          <div ng-controller="ExampleController as vm">
            <div on-select="vm.handler(selection);" auto-highlight snap-to-word>
              Bacon ipsum dolor amet ut beef ribs culpa...
            </div>
          </div>
        </file>
      </example>
   */
  function OnSelectDirective(RangeService) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {
        var options = {
          snapToWord: ('snapToWord' in attrs),
          highlight: ('autoHighlight' in attrs)
        };

        element.bind('mouseup', function () {
          var selection = RangeService.process(options);

          scope.$eval(attrs.onSelect, {
            selection: selection
          });
        });
      }
    };
  }

})();