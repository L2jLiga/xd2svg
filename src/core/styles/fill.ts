/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLElementOrXMLNode }                          from 'xmlbuilder';
import * as logger                                      from '../../utils/logger';
import { manifestInfo }                                 from '../manifest-parser';
import { applyIfPossible, colorTransformer, gradients } from '../utils';
import { Fill, GradientFill, Parser, Pattern }          from './models';

export const fill: Parser = {
  name: 'fill',
  parse: fillParser,
};

export function fillParser(src: Fill, defs: XMLElementOrXMLNode): string {

  switch (src.type) {
    case 'color':
      return colorTransformer(src.fill.color);
    case 'solid':
      return colorTransformer(src.color);
    case 'gradient':
      const gradientId: string = makeGradient(src.gradient, defs);

      return `url(#${gradientId})`;
    case 'pattern':
      createPattern(src.pattern, defs);

      return `url(#${src.pattern.meta.ux.uid})`;
    case 'none':
      return 'none';
    default:
      console.warn(`${logger.bold(logger.red('Fill/Stroke parser:'))} unknown property: %j`, src);

      return '';
  }
}

function makeGradient(gradientInfo: GradientFill['gradient'], defs: XMLElementOrXMLNode) {
  const gradient: XMLElementOrXMLNode = gradients[gradientInfo.ref].clone();
  const gradientId = 'gradient-' + Object.values(gradientInfo).join('-');

  gradient.attribute('id', gradientId);
  applyIfPossible(gradient, 'gradientUnits', gradientInfo.units);
  applyIfPossible(gradient, 'x1', gradientInfo.x1);
  applyIfPossible(gradient, 'x2', gradientInfo.x2);
  applyIfPossible(gradient, 'y1', gradientInfo.y1);
  applyIfPossible(gradient, 'y2', gradientInfo.y2);
  applyIfPossible(gradient, 'cx', gradientInfo.cx);
  applyIfPossible(gradient, 'cy', gradientInfo.cy);
  applyIfPossible(gradient, 'r', gradientInfo.r);

  defs.importDocument(gradient);

  return gradientId;
}

function createPattern(patternObject: Pattern, defs: XMLElementOrXMLNode): void {
  const resources = manifestInfo.resources;
  const pattern = defs.element('pattern', {
    height: '1',
    id: patternObject.meta.ux.uid,
    width: '1',
    x: '0',
    y: '0',
  });
  const image = pattern.element('image', {'xlink:href': `${resources[patternObject.meta.ux.uid]}`});

  if (patternObject.meta.ux.scaleBehavior === 'cover' || patternObject.meta.ux.scaleBehavior === 'fill') {
    pattern.attribute('patternContentUnits', 'objectBoundingBox');
    image.attribute('preserveAspectRatio', 'none');
    image.attribute('width', '1');
    image.attribute('height', '1');
  } else {
    image.attribute('width', `${patternObject.width}`);
    image.attribute('height', `${patternObject.height}`);
  }
}
