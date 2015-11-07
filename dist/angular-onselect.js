(function() {
  'use strict';

  /**
   * Angular module for programmatically
   *
   * @namespace onselect
   */
  angular.module('onSelect', []);

})();
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
(function() {
  'use strict';

  angular.module('onSelect')
    .factory('RangeService', RangeService);

  /**
   * @typedef {object} Options
   * @property {boolean} snapToWord expand selection to include whole words
   * @property {boolean} highlight automatically highlight selection
   *
   * @description
   * Options passed to the RangeService.process function to define additional behaviors
   * of processing.
   */

  /**
   * @namespace RangeService
   * @memberOf onselect
   * @param {$window} $window the window object
   * @param {$compile} $compile the compiler
   *
   * @description
   * The range service has a single method (process) for returning back data describing
   * the selected region.
   *
   * @ngInject
   */
  function RangeService($window, $compile) {
    var service = {};

    service.process = process;
    service.Selection = Selection;

    return service;

    /**
     * @mamberOf onselect.RangeService
     * @name process
     * @param {Options} options the options for processing
     * @returns {onselect.Selection} the selection
     *
     * @description
     * Process the current selection (as reported by $window.getSelection()) and create a
     * selection object based upon the FIRST range. Apply default behaviors based upon the
     * options as well.
     */
    function process(options) {
      var windowSelection = $window.getSelection();
      var range = windowSelection.getRangeAt(0);

      var selection = service.Selection(range);

      if (options.snapToWord) {
        selection.snapToWord();
      }

      if (options.highlight) {
        selection.highlight('<span style="background-color: yellow;"></span>');
      }

      return selection;
    }

    /**
     * @namespace Selection
     * @memberOf onselect
     * @param {Range} range the range that was surrounded
     * @constructor
     *
     * @description
     * The Selection object contains all of the behaviors for a selection including the
     * ability to expand to word boundaries, highlight and get the text content.
     */
    function Selection(range) {
      var selection = {};

      /**
       * @type {Range}
       * @desc The range
       */
      selection.range = range;

      /**
       * @type {Element}
       * @desc the HTML element that was added to surround the highlighted text or undefined if none exists.
       * @private
       */
      selection._highlighter = undefined;

      selection.isHighlighted = isHighlighted;
      selection.snapToWord = snapToWord;
      selection.highlight = highlight;
      selection.removeHighlight = removeHighlight;
      selection.getText = getText;

      return selection;

      /**
       * Returns true if this selection has already been highlighted (automatically or otherwise).
       *
       * @memeberOf onselect.Selection
       * @name isHighlighted
       *
       * @returns {boolean} true
       */
      function isHighlighted() {
        return !!selection._highlighter;
      }

      /**
       * Expand the current range so that both the beginning and end end at word boundaries.
       *
       * @memeberOf onselect.Selection
       * @name snapToWord
       */
      function snapToWord() {
        var start = selection.range.startOffset;
        var startNode = selection.range.startContainer;

        while (startNode.textContent.charAt(start) != ' ' && start > 0) {
          start--;
        }
        if (start != 0 && start != selection.range.startOffset) {
          start++;
        }

        var end = selection.range.endOffset;
        var endNode = selection.range.endContainer;
        while (endNode.textContent.charAt(end) != ' ' && end < endNode.length) {
          end++;
        }

        selection.range.setStart(startNode, start);
        selection.range.setEnd(endNode, end);
      }

      /**
       * Select the current range with a new HTML Element as defined by the given template. The template is evaluated
       * by calling $compile(template). If the contents have already been highlighted, the previous highlighting will
       * be removed first.
       *
       * This will not work if the selected text crosses HTML nodes.  In other words, the selection must be in the
       * same Text node.
       *
       * @memeberOf onselect.Selection
       * @name highlight
       *
       * @param {string} template the HTML template
       */
      function highlight(template) {
        if (selection._highlighter) {
          selection.removeHighlight();
        }

        if (range.startContainer === range.endContainer) {
          var scope = angular.element(range.startContainer).scope();
          selection._highlighter = $compile(template)(scope)[0];

          range.surroundContents(selection._highlighter);
        }
      }

      /**
       * Remove highlighting if it currently exists.
       *
       * @memeberOf onselect.Selection
       * @name removeHighlight
       */
      function removeHighlight() {
        if (selection._highlighter) {
          var parent = selection._highlighter.parentNode;
          while (selection._highlighter.firstChild) {
            parent.insertBefore(selection._highlighter.firstChild, selection._highlighter);
          }
          parent.removeChild(selection._highlighter);
          selection._highlighter = undefined;
        }
      }

      /**
       * Return the text contents of the currently highlighted range.
       *
       * @returns {string}
       */
      function getText() {
        return range.toString();
      }
    }
  }

})();