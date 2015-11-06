
ngDescribe({
  name: 'The On Select Directive',
  modules: 'onSelect',
  inject: [ '$compile', 'RangeService' ],
  parentScope: {
    sel : 'initial'
  },
  mocks: {
    onSelect: {
      RangeService : {}
    }
  },
  element: '<div on-select="sel = selection;"> </div>',
  tests: function(deps) {

    it('should call RangeService.process on mouseup', function () {
      // given
      deps.parentScope.sel.should.equal('initial');
      deps.RangeService.process = sinon.stub().returns('expected');

      // when
      deps.element.triggerHandler('mouseup');

      // then
      deps.parentScope.sel.should.equal('expected');
      deps.RangeService.process.should.have.been.calledWith({
        snapToWord: false,
        highlight: false
      });
    });
  }
});

ngDescribe({
  name: 'The On Select Directive with options turned on',
  modules: 'onSelect',
  inject: [ '$compile', 'RangeService' ],
  parentScope: {
    sel : 'initial'
  },
  mocks: {
    onSelect: {
      RangeService : {}
    }
  },
  element: '<div on-select="sel = selection;" snap-to-word auto-highlight> </div>',
  tests: function(deps) {

    it('should call RangeService.process on mouseup', function () {
      // given
      deps.parentScope.sel.should.equal('initial');
      deps.RangeService.process = sinon.stub().returns('expected');

      // when
      deps.element.triggerHandler('mouseup');

      // then
      deps.parentScope.sel.should.equal('expected');
      deps.RangeService.process.should.have.been.calledWith({
        snapToWord: true,
        highlight: true
      });
    });
  }
});