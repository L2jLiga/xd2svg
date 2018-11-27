/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLElementOrXMLNode } from 'xmlbuilder';
import { bold, red }           from '../../utils';
import { Shape }               from '../models';
import { applyIfPossible }     from '../utils';

type Strategy = 'circle' | 'ellipse' | 'line' | 'path' | 'rect';

const strategies = {
  circle: ['cx', 'cy', 'r'],
  ellipse: ['cx', 'cy', 'rx', 'ry'],
  line: ['x1', 'y1', 'x2', 'y2'],
  path: ['d<path'],
  rect: ['x', 'y', 'width', 'height'],
};

export function createShape(srcObj: Shape, parentElement: XMLElementOrXMLNode) {
  const type: Strategy = srcObj.type === 'compound' ? 'path' : srcObj.type;
  const shape = parentElement.element(type);

  applyAttrsByStrategy(type, shape, srcObj);

  return shape;
}

function applyAttrsByStrategy(strategy: Strategy, shape: XMLElementOrXMLNode, srcObj: Shape): void {
  if (!strategies[strategy]) return console.warn(`${bold(red('Shape converter:'))} unknown shape given: %j`, srcObj);

  strategies[strategy].forEach((val) => {
    const [to, from] = val.split('<');

    applyIfPossible(shape, to, srcObj[from || to]);
  });
}
