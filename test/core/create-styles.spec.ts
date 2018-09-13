/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as assert      from 'assert';
import { spy, stub }    from 'sinon';
import { createStyles } from '../../src/core/create-styles';
import parsers          from '../../src/core/styles';

describe('Core > Create styles', () => {
  it('should warn if unsupported style', () => {
    const stylesSrc = {
      unknownStyle: {},
    };

    const consoleSpy = stub(console, 'warn');

    const result = createStyles(stylesSrc, null, null);

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

    createStyles(stylesSrc, null, null);

    if (parsersSpy.callCount) {
      done();

      return;
    }

    done('Test failed: parser wasn\'t used');
  });
});
