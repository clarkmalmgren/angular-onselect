
ngDescribe({
  name: "The RangeService",
  modules: 'onSelect',
  inject: [ 'RangeService', '$window', '$compile', '$rootScope'],
  mocks: {
    onSelect: {
      $window : {
        document : {}
      }
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

        selection.snapToWord.should.have.been.called;
        selection.highlight.should.have.been.called;
      });

    });

    describe('Selection Object', function() {

      describe('snapToWord function', function() {

        it('should expand to include a word if the width is zero (click instead of drag)', function() {
          // given
          var node = new MockNode('beef flank ribeye tongue ground');
          var range = new MockRange(7, node, 7, node);
          var selection = deps.RangeService.Selection(range);

          // when
          selection.snapToWord();

          // then
          expect(range.startOffset).to.equal(5);
          expect(range.startContainer).to.equal(node);
          expect(range.endOffset).to.equal(10);
          expect(range.endContainer).to.equal(node);
          expect(selection.getText()).to.equal('flank');
        });

        it('should expand to include punctuation', function() {
          // given
          var node = new MockNode('beef flank! ribeye tongue ground');
          var range = new MockRange(7, node, 7, node);
          var selection = deps.RangeService.Selection(range);

          // when
          selection.snapToWord();

          // then
          expect(range.startOffset).to.equal(5);
          expect(range.startContainer).to.equal(node);
          expect(range.endOffset).to.equal(11);
          expect(range.endContainer).to.equal(node);
          expect(selection.getText()).to.equal('flank!');
        });

        it('should automatically stop at lower HTML node boundaries', function() {
          // given
          var node = new MockNode('beef flank ribeye tongue ground');
          var range = new MockRange(2, node, 7, node);
          var selection = deps.RangeService.Selection(range);

          // when
          selection.snapToWord();

          // then
          expect(range.startOffset).to.equal(0);
          expect(range.startContainer).to.equal(node);
          expect(range.endOffset).to.equal(10);
          expect(range.endContainer).to.equal(node);
          expect(selection.getText()).to.equal('beef flank');
        });

        it('should automatically stop at upper HTML node boundaries', function() {
          // given
          var node = new MockNode('beef flank ribeye tongue ground');
          var range = new MockRange(27, node, 28, node);
          var selection = deps.RangeService.Selection(range);

          // when
          selection.snapToWord();

          // then
          expect(range.startOffset).to.equal(25);
          expect(range.startContainer).to.equal(node);
          expect(range.endOffset).to.equal(31);
          expect(range.endContainer).to.equal(node);
          expect(selection.getText()).to.equal('ground');
        });

        it('should do nothing in a sea of spaces', function() {
          // given
          var node = new MockNode('             ');
          var range = new MockRange(4, node, 4, node);
          var selection = deps.RangeService.Selection(range);

          // when
          selection.snapToWord();

          // then
          expect(range.startOffset).to.equal(4);
          expect(range.startContainer).to.equal(node);
          expect(range.endOffset).to.equal(4);
          expect(range.endContainer).to.equal(node);
          expect(selection.getText()).to.equal('');
        });

      });

      describe('highlight function', function() {

        //it('should not create a selection if surround throws an error', function() {
        //  // preparation
        //  var _element = angular.element;
        //
        //  // given
        //  var node = new MockNode('steak');
        //  var range = new MockRange(0, node, 5, node);
        //  var selection = deps.RangeService.Selection(range);
        //
        //  var scopeCall = sinon.stub().returns(deps.$rootScope);
        //  angular.element = sinon.stub().returns({ scope: scopeCall });
        //
        //  sinon.stub(range, 'surroundContents').throws();
        //
        //  // when
        //  var worked = selection.highlight('<span style="background-color:yellow;"></span>');
        //
        //  // then
        //  worked.should.be.false;
        //  angular.element.should.have.been.called;
        //  scopeCall.should.have.been.called;
        //  range.surroundContents.should.have.been.called;
        //  selection.isHighlighted().should.be.false;
        //
        //  // cleanup
        //  angular.element = _element;
        //});

        it('should create a highlight when it can', function() {
          // preparation
          var _element = angular.element;

          // given
          var node = new MockNode('steak');
          var range = new MockRange(0, node, 5, node);
          var otherRange = new MockRange();
          var selection = deps.RangeService.Selection(range);

          var scopeCall = sinon.stub().returns(deps.$rootScope);
          angular.element = sinon.stub().returns({ scope: scopeCall });

          deps.$window.document.createRange = sinon.stub().returns(otherRange);

          sinon.spy(otherRange, 'surroundContents');

          // when
          var worked = selection.highlight('<span style="background-color:yellow;"></span>');

          // then
          worked.should.be.truthy;
          angular.element.should.have.been.called;
          scopeCall.should.have.been.called;
          otherRange.surroundContents.should.have.been.called;
          selection.isHighlighted().should.be.true;

          // cleanup
          angular.element = _element;
        });

        it('should remove an existing highlight if it exists first', function() {
          // preparation
          var _element = angular.element;

          // given
          var node = new MockNode('steak');
          var range = new MockRange(0, node, 5, node);
          var otherRange = new MockRange();
          var selection = deps.RangeService.Selection(range);

          selection._highlighter = true;
          selection.removeHighlight = sinon.spy();

          deps.$window.document.createRange = sinon.stub().returns(otherRange);

          var scopeCall = sinon.stub().returns(deps.$rootScope);
          angular.element = sinon.stub().returns({ scope: scopeCall });

          sinon.spy(otherRange, 'surroundContents');

          // when
          var worked = selection.highlight('<span style="background-color:yellow;"></span>');

          // then
          selection.removeHighlight.should.have.been.called;
          worked.should.be.truthy;
          angular.element.should.have.been.called;
          scopeCall.should.have.been.called;
          otherRange.surroundContents.should.have.been.called;
          selection.isHighlighted().should.be.true;

          // cleanup
          angular.element = _element;
        });

      });

    });

    describe('removeHighlight function', function() {

      it('should remove an existing highlight', function() {
        // given
        var node = new MockNode('steak');
        var range = new MockRange(0, node, 5, node);
        var selection = deps.RangeService.Selection(range);

        var childCalled = false;
        var child = function() {
          childCalled = true;
        };

        var highlighter = {
          parentNode : {
            insertBefore : sinon.stub().callsArg(0),
            removeChild : sinon.spy()
          },
          get firstChild() {
            return (childCalled) ? undefined : child;
          }
        };

        selection._highlighter = [highlighter];

        // when
        selection.removeHighlight();

        // then
        highlighter.parentNode.insertBefore.should.have.been.calledWith(child, highlighter);
        highlighter.parentNode.removeChild.should.have.been.calledWith(highlighter);
        selection.isHighlighted().should.be.false;
      });

      it('should do nothing if there was no highlight', function() {
        // given
        var node = new MockNode('steak');
        var range = new MockRange(0, node, 5, node);
        var selection = deps.RangeService.Selection(range);

        // when
        selection.removeHighlight();

        // then
        selection.isHighlighted().should.be.false;
      });

    });

    describe('getText function', function() {

      it('should return the text as a string', function() {
        // given
        var node = new MockNode('steak');
        var range = new MockRange(0, node, 5, node);
        var selection = deps.RangeService.Selection(range);

        // then
        selection.getText().should.equal('steak');
      });

      it('should return the text as a string across multiple nodes', function() {
        // given
        var startNode = new MockNode('beef');
        var endNode = new MockNode('steak');
        var range = new MockRange(1, startNode, 3, endNode);
        var selection = deps.RangeService.Selection(range);

        // then
        selection.getText().should.equal('eef ste');
      });

    });

  }
});

function MockRange(startIndex, startNode, endIndex, endNode) {

  this.startOffset = startIndex;
  this.startContainer = startNode;
  this.endOffset = endIndex;
  this.endContainer = endNode;

  this.setStart = function(node, index) {
    this.startOffset = index;
    this.startContainer = node;
  };

  this.setEnd = function(node, index) {
    this.endOffset = index;
    this.endContainer = node;
  };

  this.surroundContents = function() {};

  this.toString = function() {
    if (this.startContainer === this.endContainer) {
      return this.startContainer._text.substring(this.startOffset, this.endOffset);
    } else {
      return this.startContainer._text.substring(this.startOffset) + ' ' + this.endContainer._text.substring(0, this.endOffset);
    }
  };
}

function MockNode(text) {
  var node = {};
  node._text = text;
  node.textContent = {
    charAt : function(i) {
      return text.charAt(i);
    }
  };
  node.length = text.length;
  return node;
}