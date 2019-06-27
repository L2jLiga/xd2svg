/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLNode }                          from 'xmlbuilder';
import * as logger                                      from '../../../common/utils/logger';
import { manifestInfo }                                 from '../manifest-parser';
import { applyIfPossible, colorTransformer, gradients } from '../utils';
import { Fill, GradientFill, Parser, Pattern }          from './models';

export const fill: Parser = {
  name: 'fill',
  parse: fillParser,
};

export function fillParser(src: Fill, defs: XMLNode): string {

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

function makeGradient(gradientInfo: GradientFill['gradient'], defs: XMLNode) {
  const gradient = gradients[gradientInfo.ref];
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

function createPattern(patternObject: Pattern, defs: XMLNode): void {
  const resources = manifestInfo.resources;
  const scaleBehaviors = ['fill', 'cover'];

  const {width, height, meta: {ux: {uid, scaleBehavior}}} = patternObject;

  if (!scaleBehaviors.includes(scaleBehavior )) {
    return console.warn(`${logger.bold(logger.red('Fill/Stroke parser:'))} unknown property: %j`, patternObject);
  }

  const pattern = defs
    .element('pattern', {
      height: '100%',
      id: uid,
      viewBox: `0 0 ${width} ${height}`,
      width: '100%',
    });

  if (scaleBehavior === 'cover') {
    pattern.attribute('preserveAspectRatio', 'xMidYMid slice');
  }

  pattern.element('image', {
    height,
    width,
    'xlink:href': `${resources[uid]}`,
  });
}
