/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLNode }                       from 'xmlbuilder';
import { camelToDash, colorTransformer } from '../utils';
import { Parser }                        from './models';

export const filters: Parser = {
  name: 'filter',
  parse: (src: any[], defs: XMLNode) => new FiltersParser(src, defs).getStyle(),
};

class FiltersParser {

  private get filterNo() {
    return FiltersParser.getChildrenCount(this.defs);
  }

  private static getChildrenCount(ele: any): number {
    return ele.children.length;
  }

  private filter: XMLNode;
  private filterId: string;

  constructor(src: any[], private defs: XMLNode) {
    this.filter = defs.element('filter');
    this.filterId = src.reduceRight(this.createFilters, `filter-${this.filterNo}-`);
    this.filter.attribute('id', this.filterId);

    if (this.isFilterEmpty()) {
      this.filterId = '';
      this.filter.remove();
    }
  }

  public getStyle() {
      return this.filterId
        ? `url(#${this.filterId})`
        : '';
  }

  private createFilters = (filterId: string, filterDesc: any, index: number): string => {
    const type = FilterUtils.getFilterType(filterDesc);
    const filterParams = FilterUtils.getFilterParams(filterDesc);

    if (FilterUtils.unsupportedFilter(type)) return filterId;
    if (FilterUtils.invisibleFilter(filterDesc)) return filterId;

    filterId += type === 'blur'
      ? this.createBlur(filterParams, index)
      : this.createShadow(filterParams);

    return filterId;
  }

  private createBlur(filterParams: any, index: number): string {
    FilterUtils.createBlur(this.filter, filterParams, `${this.filterNo}-${index}`);

    return `blur-${filterParams.blurAmount}-${filterParams.brightnessAmount}`;
  }

  private createShadow(filterParams: any) {
    let addition = '';

    for (const {dx, dy, r, color} of filterParams) {
      addition += `drop-shadow-${dx}-${dy}-${r}-${color.mode}`;

      this.filter
        .element('feDropShadow', {
          dx,
          dy,
          'flood-color': colorTransformer(color),
          'in': 'SourceGraphic',
          'stdDeviation': r,
        });
    }

    return addition;
  }

  private isFilterEmpty(): boolean {
    return !FiltersParser.getChildrenCount(this.filter);
  }
}

// tslint:disable-next-line:max-classes-per-file
class FilterUtils {

  public static unsupportedFilter(type: string) {
    const supportedTypes = ['blur', 'drop-shadow'];

    if (!supportedTypes.includes(type)) {
      console.log(`Unsupported filter type: ${type}`);

      return true;
    }

    return false;
  }

  public static invisibleFilter(filterDesc: any): boolean {
    return filterDesc.visible === false || filterDesc.params && filterDesc.params.visible === false;
  }

  public static getFilterType(filterDesc: any) {
    return filterDesc.type.includes('#blur') ? 'blur' : camelToDash(filterDesc.type);
  }

  public static getFilterParams(filterDesc: any): any {
    return filterDesc.params && filterDesc.params[filterDesc.type + 's'] || filterDesc.params || {};
  }

  // TODO: Still work not so fine as I expect
  public static createBlur(filter: XMLNode, filterParams: any, filterPostfix: string): void {
    FilterUtils.makeFeGaussianBlur(filter, filterPostfix, filterParams);
    FilterUtils.makeFeComponentTransfer(filter, filterPostfix, filterParams);
    FilterUtils.makeFeComposite(filter, filterPostfix);

    if (filterParams.fillOpacity !== 0) {
      const feMerge = filter.element('feMerge');
      feMerge.element('feMergeNode', {in: 'SourceGraphic'});
      feMerge.element('feMergeNode', {in: `composite-${filterPostfix}`});
    }
  }

  private static makeFeGaussianBlur(parent: XMLNode, filterPostfix: string, filterParams: any) {
    parent
      .element('feGaussianBlur', {
        in: FilterUtils.getBackgroundEffect(filterParams),
        result: `blur-${filterPostfix}`,
        stdDeviation: filterParams.blurAmount,
      });
  }

  private static makeFeComponentTransfer(parent: XMLNode, filterPostfix: string, filterParams: any): void {
    const feComponentTransfer = parent.element('feComponentTransfer', {
      in: FilterUtils.getBackgroundEffect(filterParams),
      result: `transfer-${filterPostfix}`,
    });

    const slope = FilterUtils.brigtnessToSlope(filterParams.brightnessAmount);
    feComponentTransfer.element('feFuncR', {type: 'linear', slope});
    feComponentTransfer.element('feFuncG', {type: 'linear', slope});
    feComponentTransfer.element('feFuncB', {type: 'linear', slope});
    feComponentTransfer.element('feFuncA', {type: 'linear', slope: filterParams.fillOpacity});
  }

  private static getBackgroundEffect(filterParams: any) {
    return filterParams.backgroundEffect ? 'BackgroundImage' : 'SourceGraphic';
  }

  private static brigtnessToSlope(brightness: number): number {
    return (brightness + 50) / 200;
  }

  private static makeFeComposite(parent: XMLNode, filterPostfix: string): void {
    parent.element('feComposite', {
      in: `blur-${filterPostfix}`,
      in2: `transfer-${filterPostfix}`,
      operator: 'in',
      result: `composite-${filterPostfix}`,
    });
  }
}
