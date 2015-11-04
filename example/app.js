(function() {

  angular.module('onSelectExample', ['onSelect'])
    .controller('ExampleController', ExampleController);


  function ExampleController() {
    var vm = this;
    vm.person = "Dino";

    vm.doStuff = doStuff;

    return vm;

    function doStuff(text) {
      window.alert(text)
    }
  }

})();