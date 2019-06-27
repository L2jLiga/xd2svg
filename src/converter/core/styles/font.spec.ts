/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as assert from 'assert';
import { font }    from './font';

describe('Core > Styles parsers > Font', () => {
  it('should return styles string with presented styles', () => {
    const testCases = [
      {
        given: {postscriptName: 'test'},
        result: 'font-family: test',
      },
      {
        given: {family: 'test'},
        result: 'font-family: test',
      },
      {
        given: {postscriptName: 'demo', family: 'test'},
        result: 'font-family: demo, test',
      },
      {
        given: {style: 'Bold'},
        result: 'font-weight: 700',
      },
      {
        given: {size: 16},
        result: 'font-size: 16px',
      },
      {
        given: {style: 'Medium', size: 22},
        result: 'font-size: 22px;font-weight: 500',
      },
      {
        given: {style: 'Semibold Italic', size: 16},
        result: 'font-size: 16px;font-style: italic;font-weight: 600',
      },
      {
        given: {style: 'Condensed Bold'},
        result: 'font-stretch: condensed;font-weight: 700',
      },
    ];

    testCases.forEach((testCase) => {
      const result = font.parse(testCase.given);

      assert.equal(result, testCase.result);
    });
  });
});
