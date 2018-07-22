/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { assert }      from 'chai';
import { camelToDash } from '../../../src/core/utils/camel-to-dash';

describe('Core > Utils > Camel to Dash:', () => {
  it('should convert camelCase string to dash-case', () => {
    const str = 'CamelCaseString';

    const result = camelToDash(str);

    assert.equal(result, 'camel-case-string');
  });
});
