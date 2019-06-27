/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as assert          from 'assert';
import { Color }            from '../styles/models';
import { colorTransformer } from './color-transformer';

describe('Core > Utils > Color Transformer: ', () => {
  it('should return #fff if no params specified', () => {
    const result = colorTransformer();

    assert.equal(result, '#fff');
  });

  it('should return hex value', () => {
    const color: Color = {value: 123435};

    const result = colorTransformer(color);

    assert.equal(result, `#${color.value.toString(16)}`);
  });

  it('should return rgb value', () => {
    const color: Color = {
      mode: 'RGB',
      value: {
        b: 3,
        g: 2,
        r: 1,
      },
    };

    const result = colorTransformer(color);

    assert.equal(result, 'rgb(1,2,3)');
  });

  it('should return rgba value', () => {
    const color: Color = {
      alpha: .4,
      mode: 'RGB',
      value: {
        b: 3,
        g: 2,
        r: 1,
      },
    };

    const result = colorTransformer(color);

    assert.equal(result, 'rgba(1,2,3,0.4)');
  });

  it('should correctly parse color also if alpha equal to 0', () => {
    const color: Color = {
      alpha: 0,
      mode: 'RGB',
      value: {
        b: 0,
        g: 0,
        r: 0,
      },
    };

    const result = colorTransformer(color);

    assert.equal(result, 'rgba(0,0,0,0)');
  });

  it('should return hsl value', () => {
    const color: Color = {
      mode: 'HSL',
      value: {
        h: 1,
        l: 3,
        s: 2,
      },
    };

    const result = colorTransformer(color);

    assert.equal(result, 'hsl(1,2,3)');
  });

  it('should return hsla value', () => {
    const color: Color = {
      alpha: .4,
      mode: 'HSL',
      value: {
        h: 1,
        l: 3,
        s: 2,
      },
    };

    const result = colorTransformer(color);

    assert.equal(result, 'hsla(1,2,3,0.4)');
  });
});
