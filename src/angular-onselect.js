(function() {

  angular.module('onSelect', [])
    .directive('onSelect', OnSelectDirective);

  function OnSelectDirective() {
    return {
      restrict: 'A',
      link: function breakpointLink(scope, element, attrs) {
        element.bind('mouseup', function() {
          var selection = window.getSelection();
          var range = selection.getRangeAt(0);

          var start = range.startOffset;
          while (range.startContainer.textContent.charAt(start) != ' ' && start > 0) {
            start--;
          }
          start++;

          var end = range.endOffset;
          while (range.endContainer.textContent.charAt(end) != ' ' && end < range.endContainer.length) {
            end++;
          }

          range.setStart(range.startContainer, start);
          range.setEnd(range.endContainer, end);

          if (range.startContainer === range.endContainer) {
            var highlight = document.createElement("span");
            highlight.style.backgroundColor = 'yellow';

            range.surroundContents(highlight);
          }

          //selection.clear();

          scope.$eval(attrs.onSelect, {
            selection: selection,
            range: range,
            text : range.toString()
          });
        });
      }
    };
  }

})();