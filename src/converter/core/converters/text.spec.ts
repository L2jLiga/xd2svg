/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { equal }         from 'assert';
import { begin }         from 'xmlbuilder';
import { Text }          from '../models';
import { TextConverter } from './index';

describe('Core > Converters > Text', () => {
  it('should create text from source', () => {
    const parent = begin();
    const source: Text = {
      paragraphs: [
        {
          lines: [
            [
              {from: 0, to: 1},
              {from: 1, to: 2, x: 5},
            ],
            [
              {from: 2, to: 3, y: 5},
              {from: 3, to: 4, x: 5, y: 5},
            ],
          ],
        },
      ],
      rawText: 'test',
    };

    TextConverter.createText(source, parent);

    equal(parent.end(), `<text><tspan>t</tspan><tspan x="5">e</tspan><tspan y="5">s</tspan><tspan x="5" y="5">t</tspan></text>`);
  });
});
