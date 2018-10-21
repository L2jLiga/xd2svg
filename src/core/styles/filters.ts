/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLElementOrXMLNode } from 'xmlbuilder';
import { camelToDash }         from '../utils/camel-to-dash';
import { colorTransformer }    from '../utils/color-transformer';
import { Parser }              from './models';

export const filters: Parser = {
  name: 'filter',
  parse: filtersParser,
};

function filtersParser(src: any[], defs: XMLElementOrXMLNode): string {
  const filter = defs.element('filter');
  const filterNo = ((defs as any).children as []).length;
  let filterId: string = `filter-${filterNo}-`;

  src.reverse().forEach((filterDesc: any, index: number) => {
    const filterName = filterDesc.type.includes('#blur') ? 'blur' : camelToDash(filterDesc.type);
    const filterParams = filterDesc.params && filterDesc.params[filterDesc.type + 's'] || filterDesc.params || {};

    if (filterDesc.visible === false || filterParams.visible === false) return;

    switch (filterName) {
      case 'blur': {
        filterId += `blur-${filterParams.blurAmount}-${filterParams.brightnessAmount}`;

        filter
          .element('feGaussianBlur', {
            in: 'SourceGraphic',
            result: `blur-${filterNo}-${index}`,
            stdDeviation: filterParams.blurAmount,
          }).up()
          .element('feComponentTransfer', {in: `blur-${filterNo}-${index}`, result: `blur-${filterNo}-${index}`})
          .element('feFuncR', {type: 'linear', slope: filterParams.brightnessAmount / 100}).up()
          .element('feFuncG', {type: 'linear', slope: filterParams.brightnessAmount / 100}).up()
          .element('feFuncB', {type: 'linear', slope: filterParams.brightnessAmount / 100}).up()
          .element('feFuncA', {type: 'linear', slope: filterParams.fillOpacity}).up();

        if (filterParams.fillOpacity !== 0) {
          filter
            .element('feMerge')
            .element('feMergeNode', {in: `blur-${filterNo}-${index}`}).up()
            .element('feMergeNode', {in: 'SourceGraphic'});
        }

        break;
      }

      case 'drop-shadow': {
        for (const {dx, dy, r, color} of filterParams) {
          filterId += `drop-shadow-${dx}-${dy}-${r}-${color.mode}`;

          filter
            .element('feDropShadow', {
              dx,
              dy,
              'flood-color': colorTransformer(color),
              'in': 'SourceGraphic',
              'stdDeviation': r,
            });
        }

        break;
      }

      default:
        console.log(`Currently unsupported filter: ${filterName}`);
    }
  });

  filter.attribute('id', filterId);

  if (!(filter as any).children.length) {
    filter.remove();

    return null;
  }

  return `url(#${filterId})`;
}
