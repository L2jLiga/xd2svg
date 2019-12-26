/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { strictEqual }  from 'assert';
import { createStyles } from './create-styles';

describe('Core > Create styles', () => {
  it('should return empty string when no one parsers is known', () => {
    const stylesSrc = {
      unknownStyle: {},
    };

    const result = createStyles(stylesSrc, null);

    strictEqual(result, '');
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

    strictEqual(styles, `font-family: Arial-Bold, Arial; font-size: 15px; font-weight: 700; opacity: 0.4`);
  });
});
