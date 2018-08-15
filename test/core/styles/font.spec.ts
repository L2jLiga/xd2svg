/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as assert from 'assert';
import { font }   from '../../../src/core/styles/font';

describe('Core > Styles parsers > Font', () => {
  it('should return styles string with presented styles', () => {
    const testCases = [
      {
        given: {postscriptName: 'test'},
        expected: 'font-family: test',
      },
      {
        given: {family: 'test'},
        expected: 'font-family: test',
      },
      {
        given: {postscriptName: 'demo', family: 'test'},
        expected: 'font-family: demo, test',
      },
      {
        given: {style: 'Bold'},
        expected: 'font-weight: 700',
      },
      {
        given: {size: 16},
        expected: 'font-size: 16px',
      },
      {
        given: {style: 'Medium', size: 22},
        expected: 'font-weight: 500;font-size: 22px',
      },
    ];

    testCases.forEach((testCase) => {
      const result = font.parse(testCase.given);

      assert.equal(result, testCase.expected);
    });
  });
});
