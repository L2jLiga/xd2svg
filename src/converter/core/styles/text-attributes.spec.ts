/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { strictEqual }    from 'assert';
import { textAttributes } from './text-attributes';

describe('Core > Styles parsers > Text attributes', () => {
  it('should return all presented text attributes', () => {
    const cases = [
      {
        attributes: {},
        expect: '',
      },
      {
        attributes: {
          lineHeight: 1,
        },
        expect: 'line-height: 1px',
      },
      {
        attributes: {
          lineHeight: 1,
          paragraphAlign: 'center',
        },
        expect: 'line-height: 1px;text-align: center',
      },
      {
        attributes: {
          letterSpacing: 5,
          lineHeight: 1,
        },
        expect: 'line-height: 1px;letter-spacing: 0.005em',
      },
    ];

    cases.forEach((testCase) => {
      const result = textAttributes.parse(testCase.attributes);

      strictEqual(result, testCase.expect);
    });
  });
});
