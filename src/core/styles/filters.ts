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
  const filterNo = elementChildrenCount(defs);
  let filterId: string = `filter-${filterNo}-`;

  src.reverse().forEach((filterDesc: any, index: number) => {
    const filterName = filterDesc.type.includes('#blur') ? 'blur' : camelToDash(filterDesc.type);
    const filterParams = getFilterParams(filterDesc);

    if (filterInvisible(filterDesc)) return;

    switch (filterName) {
      case 'blur': {
        filterId += `blur-${filterParams.blurAmount}-${filterParams.brightnessAmount}`;

        return makeBlurFilter(filter, filterParams, `${filterNo}-${index}`);
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

  if (!elementChildrenCount(filter)) {
    filter.remove();

    return null;
  }

  filter.attribute('id', filterId);

  return `url(#${filterId})`;
}

function elementChildrenCount(ele: any): number {
  return ele.children.length;
}

function getFilterParams(filterDesc: any): any {
  return filterDesc.params && filterDesc.params[filterDesc.type + 's'] || filterDesc.params || {};
}

function filterInvisible(filterDesc: any): boolean {
  return filterDesc.visible === false || filterDesc.params && filterDesc.params.visible === false;
}

// TODO: Still work not so fine as I expect
function makeBlurFilter(filter: XMLElementOrXMLNode, filterParams: any, filterPostfix: string): void {
  filter
    .element('feGaussianBlur', {
      in: 'SourceGraphic',
      result: `blur-${filterPostfix}`,
      stdDeviation: filterParams.blurAmount,
    }).up()
    .element('feComponentTransfer', {in: `blur-${filterPostfix}`, result: `blur-${filterPostfix}`})
    .element('feFuncR', {type: 'linear', slope: filterParams.brightnessAmount / 100}).up()
    .element('feFuncG', {type: 'linear', slope: filterParams.brightnessAmount / 100}).up()
    .element('feFuncB', {type: 'linear', slope: filterParams.brightnessAmount / 100}).up()
    .element('feFuncA', {type: 'linear', slope: filterParams.fillOpacity}).up();

  if (filterParams.fillOpacity !== 0) {
    filter
      .element('feMerge')
      .element('feMergeNode', {in: `blur-${filterPostfix}`}).up()
      .element('feMergeNode', {in: 'SourceGraphic'});
  }
}
