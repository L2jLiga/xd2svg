/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as assert from 'assert';
import { JSDOM }                     from 'jsdom';
import { context, document, window } from '../../../src/core/utils/global-namespace';

describe('Core > Utils > Global namespace', () => {
  it('should be expected instance of', () => {
    assert.ok(context instanceof JSDOM);
    assert.ok(window);
    assert.ok(document);
  });
});
