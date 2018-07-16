import { assert }         from 'chai';
import { fill }           from '../../../src/core/styles/fill';
import { Color, Pattern } from '../../../src/core/styles/models';
import { stroke }         from '../../../src/core/styles/stroke';
import { createElement }  from '../../../src/core/utils/create-element';

describe('Core > Styles parsers', () => {
  describe(' > Fill', () => {
    it('should return none when type is none', () => {
      const type = 'none';

      const result = fill.parse({type});

      assert.equal(result, type);
    });

    it('should return color when type is color', () => {
      const type = 'color';
      const color: Color = {value: 123456};

      const result = fill.parse({type, fill: {color}});

      assert.equal(result, `#${color.value.toString(16)}`);
    });

    it('should try to transform color when type isn\'t specified', () => {
      const cases = [
        {
          expect: '#fff',
          fill: {},
        },
        {
          expect: 'rgb(1,2,3)',
          fill: {color: {mode: 'RGB', value: {r: 1, g: 2, b: 3}}},
        },
      ];

      cases.forEach((testCase) => {
        const result = fill.parse(testCase.fill);

        assert.equal(result, testCase.expect);
      });
    });

    it('should return ref to gradient when type is gradient', () => {
      const gradientRef = 'test-ref';

      const result = fill.parse({type: 'gradient', gradient: {ref: gradientRef}});

      assert.equal(result, `url(#${gradientRef})`);
    });

    it('should append pattern element to parent and return ref to this pattern if type is pattern', () => {
      const uuid = 'uuid';
      const parent = createElement('svg');
      const pattern: Pattern = {
        meta: {
          ux: {
            uid: 'uid',
            scaleBehavior: 'fill',
            hrefLastModifiedDate: 1,
          },
        },
        href: 'href',
        height: 1,
        width: 1,
      };

      const result = fill.parse({type: 'pattern', pattern}, parent, uuid, {});

      assert.equal(result, `url(#${pattern.meta.ux.uid})`);
      assert.equal(parent.childElementCount, 1);
      assert.equal(parent.children[0].tagName, 'pattern');
    });
  });

  describe(' > Stroke', () => {
    it('should return none when type is none', () => {
      const type = 'none';

      const result = stroke.parse({type});

      assert.equal(result, type);
    });

    it('should return color when type is color', () => {
      const type = 'color';
      const color: Color = {value: 123456};

      const result = stroke.parse({type, fill: {color}});

      assert.equal(result, `#${color.value.toString(16)}`);
    });

    it('should try to transform color when type isn\'t specified', () => {
      const cases = [
        {
          expect: '#fff',
          stroke: {},
        },
        {
          expect: 'rgb(1,2,3)',
          stroke: {color: {mode: 'RGB', value: {r: 1, g: 2, b: 3}}},
        },
      ];

      cases.forEach((testCase) => {
        const result = stroke.parse(testCase.stroke);

        assert.equal(result, testCase.expect);
      });
    });

    it('should return ref to gradient when type is gradient', () => {
      const gradientRef = 'test-ref';

      const result = stroke.parse({type: 'gradient', gradient: {ref: gradientRef}});

      assert.equal(result, `url(#${gradientRef})`);
    });

    it('should append pattern element to parent and return ref to this pattern if type is pattern', () => {
      const uuid = 'uuid';
      const parent = createElement('svg');
      const pattern: Pattern = {
        meta: {
          ux: {
            uid: 'uid',
            scaleBehavior: 'fill',
            hrefLastModifiedDate: 1,
          },
        },
        href: 'href',
        height: 1,
        width: 1,
      };

      const result = stroke.parse({type: 'pattern', pattern}, parent, uuid, {});

      assert.equal(result, `url(#${pattern.meta.ux.uid})`);
      assert.equal(parent.childElementCount, 1);
      assert.equal(parent.children[0].tagName, 'pattern');
    });

    it('should add stroke width if it present', () => {
      const type = 'color';
      const color: Color = {value: 123456};

      const result = stroke.parse({type, fill: {color}, width: 1});

      assert.equal(result, `#${color.value.toString(16)};stroke-width:1px`);
    });
  });
});
