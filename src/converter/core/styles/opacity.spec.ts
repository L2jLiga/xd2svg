/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { strictEqual } from 'assert';
import { opacity }     from './opacity';

describe('Core > Styles parsers > Opacity', () => {
  it('should return url with href', () => {
    const given = 'block';

    const result = opacity.parse(given);

    strictEqual(result, given);
  });
});
