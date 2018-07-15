import { assert }           from 'chai';
import { Color }            from '../../../src/core/styles/models';
import { colorTransformer } from '../../../src/core/utils/color-transformer';

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
        r: 1,
        g: 2,
        b: 3,
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
        r: 1,
        g: 2,
        b: 3,
      },
    };

    const result = colorTransformer(color);

    assert.equal(result, 'rgba(1,2,3,0.4)');
  });

  it('should return hsl value', () => {
    const color: Color = {
      mode: 'HSL',
      value: {
        h: 1,
        s: 2,
        l: 3,
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
        s: 2,
        l: 3,
      },
    };

    const result = colorTransformer(color);

    assert.equal(result, 'hsla(1,2,3,0.4)');
  });
});
