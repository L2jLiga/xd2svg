/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLElementOrXMLNode } from 'xmlbuilder';
import { bold, red }           from '../../utils';
import { createElem }          from '../artboard-converter';
import { Shape }               from '../models';

export function createShape(srcObj: Shape, parentElement: XMLElementOrXMLNode, defs: XMLElementOrXMLNode) {
  const shape = parentElement.element(srcObj.type === 'compound' ? 'path' : srcObj.type);

  switch (srcObj.type) {
    case 'compound':
      createElem(srcObj, shape, defs);

    case 'path':
      shape.attribute('d', srcObj.path);
      break;

    case 'rect':
      shape.attribute('x', srcObj.x);
      shape.attribute('y', srcObj.y);
      shape.attribute('width', srcObj.width);
      shape.attribute('height', srcObj.height);
      break;

    case 'circle':
      shape.attribute('cx', srcObj.cx);
      shape.attribute('cy', srcObj.cy);
      shape.attribute('r', srcObj.r);
      break;

    case 'ellipse':
      shape.attribute('cx', srcObj.cx);
      shape.attribute('cy', srcObj.cy);
      shape.attribute('rx', srcObj.rx);
      shape.attribute('ry', srcObj.ry);
      break;

    case 'line':
      shape.attribute('x1', srcObj.x1);
      shape.attribute('y1', srcObj.y1);
      shape.attribute('x2', srcObj.x2);
      shape.attribute('y2', srcObj.y2);
      break;

    default:
      console.warn(`${bold(red('Shape converter:'))} unknown shape given: %j`, srcObj);
  }

  return shape;
}
