(function() {
  'use strict';

  angular.module('onSelectExample', ['onSelect'])
    .controller('ExampleController', ExampleController);


  function ExampleController($scope) {
    var vm = this;
    vm.lastSelectedText = undefined;

    vm.doStuff = doStuff;

    return vm;

    function doStuff(selection) {
      vm.lastSelectedText = selection.getText();

      selection.highlight('<span class="label label-info"></span>');
      setTimeout(selection.removeHighlight, 2000);

      $scope.$apply();
    }
  }

})();
