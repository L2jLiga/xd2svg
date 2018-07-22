/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

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
