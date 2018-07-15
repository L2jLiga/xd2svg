import { assert }        from 'chai';
import { createElement } from '../../../src/core/utils/create-element';
import { window }        from '../../../src/core/utils/global-namespace';

describe('Core > Utils > Create Element:', () => {
  it('should create element', () => {
    const element = createElement('svg');

    assert.equal(element.tagName, 'svg');
    assert.isTrue(element instanceof window.Element);
  });

  it('should create element with attributes', () => {
    const element = createElement('body', {
      class: 'myClass',
      id: 'attrVal',
    });

    assert.equal(element.tagName, 'body');
    assert.equal(element.getAttribute('class'), 'myClass');
    assert.equal(element.getAttribute('id'), 'attrVal');
    assert.isTrue(element instanceof window.Element);
  });
});
