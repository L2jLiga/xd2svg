/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { equal }        from 'assert';
import { createStyles } from '../../src/core/create-styles';

describe('Core > Create styles', () => {
  it('should return empty string when no one parsers is known', () => {
    const stylesSrc = {
      unknownStyle: {},
    };

    const result = createStyles(stylesSrc, null);

    equal(result, '');
  });

  it('should use parser for known properties, filter empty and return formatted string', () => {
    const stylesSrc = {
      display: '',
      font: {
        family: 'Arial',
        postscriptName: 'Arial-Bold',
        size: 15,
        style: 'Bold',
      },
      opacity: 0.4,
      unknownProperty: null,
    };

    const styles = createStyles(stylesSrc, null);

    equal(styles, `font-family: Arial-Bold, Arial; font-weight: 700; font-size: 15px; opacity: 0.4`);
  });
});
