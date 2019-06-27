/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { equal }          from 'assert';
import { begin, XMLNode } from 'xmlbuilder';
import { Shape }          from '../models';
import { createShape }    from './index';

describe(`Core > Converters > Shape`, () => {
  let parentElement: XMLNode;

  beforeEach(() => {
    parentElement = begin();
  });

  it(`should create path element`, () => {
    const shape: Shape = {
      path: 'M0',
      type: 'path',
    };

    const actual = createShape(shape, parentElement);

    equal(actual, `<path d="M0"/>`);
  });

  it(`should create compound element`, () => {
    const shape: Shape = {
      children: [],
      path: 'M0',
      type: 'compound',
    };

    const actual = createShape(shape, parentElement).end();

    equal(actual, `<path d="M0"/>`);
  });

  it(`should create rectangle element`, () => {
    const shape: Shape = {
      height: 4,
      type: 'rect',
      width: 3,
      x: 1,
      y: 2,
    };

    const actual = createShape(shape, parentElement).end();

    equal(actual, `<rect x="1" y="2" width="3" height="4"/>`);
  });

  it(`should create circle element`, () => {
    const shape: Shape = {
      cx: 1,
      cy: 2,
      r: 3,
      type: 'circle',
    };

    const actual = createShape(shape, parentElement).end();

    equal(actual, `<circle cx="1" cy="2" r="3"/>`);
  });

  it(`should create ellipse element`, () => {
    const shape: Shape = {
      cx: 1,
      cy: 2,
      rx: 3,
      ry: 4,
      type: 'ellipse',
    };

    const actual = createShape(shape, parentElement).end();

    equal(actual, `<ellipse cx="1" cy="2" rx="3" ry="4"/>`);
  });

  it(`should create line element`, () => {
    const shape: Shape = {
      type: 'line',
      x1: 1,
      x2: 2,
      y1: 3,
      y2: 4,
    };

    const actual = createShape(shape, parentElement).end();

    equal(actual, `<line x1="1" y1="3" x2="2" y2="4"/>`);
  });
});
