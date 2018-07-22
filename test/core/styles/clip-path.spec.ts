/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { assert }   from 'chai';
import { clipPath } from '../../../src/core/styles/clip-path';

describe('Core > Styles parsers > Clip path', () => {
  it('should return url with href', () => {
    const ref = 'test-href';

    const result = clipPath.parse({ref});

    assert.equal(result, `url(#${ref})`);
  });
});
