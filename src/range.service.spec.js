
ngDescribe({
  name: "RangeService",
  modules: 'onSelect',
  inject: [ 'RangeService', '$window' ],
  mocks: {
    onSelect: {
      $window : {}
    }
  },
  tests: function(deps) {

    describe('process function', function() {

      it('should create a Selection', function() {
        // given
        var selection = sinon.spy();
        sinon.stub(deps.RangeService, 'Selection').returns(selection);

        var range = sinon.spy();
        var windowSelection = {};
        windowSelection.getRangeAt = sinon.stub().returns(range);
        deps.$window.getSelection = sinon.stub().returns(windowSelection);

        // when
        var processed = deps.RangeService.process({});

        // then
        expect(processed).to.equal(selection);
        expect(deps.RangeService.Selection).to.have.been.calledWith(range);
      });

      it('should create a Selection with options turned on', function() {
        // given
        var selection = {
          snapToWord : sinon.spy(),
          highlight : sinon.spy()
        };
        sinon.stub(deps.RangeService, 'Selection').returns(selection);

        var range = sinon.spy();
        var windowSelection = {};
        windowSelection.getRangeAt = sinon.stub().returns(range);
        deps.$window.getSelection = sinon.stub().returns(windowSelection);

        // when
        var processed = deps.RangeService.process({ snapToWord : true, highlight : true });

        // then
        expect(processed).to.equal(selection);
        expect(deps.RangeService.Selection).to.have.been.calledWith(range);

        expect(selection.snapToWord).to.have.been.called;
        expect(selection.highlight).to.have.been.called;
      });

    });

  }
});