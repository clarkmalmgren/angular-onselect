(function() {

  angular.module('onSelect')
    .directive('onSelect', OnSelectDirective);


  function OnSelectDirective(RangeService) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('mouseup', function () {
          var options = {
            snapToWord: ('snapToWord' in attrs),
            highlight: ('autoHighlight' in attrs)
          };

          var selection = RangeService.process(options);

          scope.$eval(attrs.onSelect, {
            selection: selection
          });
        });
      }
    };
  }

})();