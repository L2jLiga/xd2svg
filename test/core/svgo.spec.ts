/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as assert from 'assert';
import * as SVGO   from 'svgo';
import { svgo }    from '../../src/core/svgo';

describe('Core > SVGO', () => {
  it('should create SVGO instance', () => {
    assert.ok(svgo instanceof SVGO);
  });
});
