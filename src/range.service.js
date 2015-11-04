(function() {
  'use strict';

  angular.module('onSelect')
    .factory('RangeService', RangeService);

  /**
   *
   */
  function RangeService($window) {
    var service = {};

    service.process = process;

    return service;

    function process(options) {
      var windowSelection = $window.getSelection();
      var range = windowSelection.getRangeAt(0);

      var selection = new Selection(range);

      if (options.snapToWord) {
        selection.snapToWord();
      }

      if (options.highlight) {
        selection.highlight('span', function(node) {
          node.style.background = 'yellow';
        });
      }

      return selection;
    }

  }

  function Selection(range) {
    var selection = {};

    selection.range = range;
    selection._highlighter = undefined;
    selection.isHighlighted = isHighlighted;
    selection.snapToWord = snapToWord;
    selection.highlight = highlight;
    selection.removeHighlight = removeHighlight;
    selection.getText = getText;

    return selection;

    function isHighlighted() {
      return !!selection._highlighter;
    }

    function snapToWord() {
      var start = selection.range.startOffset;
      var startNode = selection.range.startContainer;

      while (startNode.textContent.charAt(start) != ' ' && start > 0) {
        start--;
      }
      start++;

      var end = selection.range.endOffset;
      var endNode = selection.range.endContainer;
      while (endNode.textContent.charAt(end) != ' ' && end < endNode.length) {
        end++;
      }

      selection.range.setStart(startNode, start);
      selection.range.setEnd(endNode, end);
    }

    function highlight(tag, decorator) {
      if (range.startContainer === range.endContainer) {
        selection._highlighter = document.createElement(tag);
        decorator(selection._highlighter);

        range.surroundContents(selection._highlighter);

        setTimeout(function () {
        }, 2000);
      }
    }

    function removeHighlight() {
      var parent = selection._highlighter.parentNode;
      while (selection._highlighter.firstChild) {
        parent.insertBefore(selection._highlighter.firstChild, selection._highlighter);
      }
      parent.removeChild(selection._highlighter);
    }

    function getText() {
      return range.toString();
    }
  }

})();