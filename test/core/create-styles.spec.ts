import { assert }       from 'chai';
import { spy, stub }    from 'sinon';
import { createStyles } from '../../src/core/create-styles';
import parsers          from '../../src/core/styles';

describe('Core > Create styles', () => {
  it('should warn if unsupported style', () => {
    const stylesSrc = {
      unknownStyle: {},
    };

    const consoleSpy = stub(console, 'warn');

    const result = createStyles(stylesSrc, null, null, null);

    assert.equal(result, '');
    assert.equal(consoleSpy.called, true);
    assert.equal(consoleSpy.callCount, 1);

    consoleSpy.restore();
  });

  it('should use parser if it present for current style', (done) => {
    const stylesSrc = {
      display: {},
    };

    const parsersSpy = spy(parsers.display, 'parse');

    createStyles(stylesSrc, null, null, null);

    if (parsersSpy.callCount) {
      done();
    }

    done('Test failed: parser wasn\'t used');
  });
});
