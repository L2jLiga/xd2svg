/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLNode }                              from 'xmlbuilder';
import { Options }                              from '../../../../common';
import { createShape }                          from '../../converters';
import { Shape }                                from '../../models';
import { Artboard, ShapeArtboard }              from '../../models/artboard';
import { CompoundPath, Rectangle }              from '../../models/shape';
import { createElem }                           from '../create-elem';
import { svgRectToClipPath, SvgRectToClipPath } from '../svg-rect-to-clip-path';
import { ElementBuilder }                       from './element-builder';

export class ShapeBuilder implements ElementBuilder<ShapeArtboard> {
  public supports(svgObject: Artboard): svgObject is ShapeArtboard {
    return svgObject.type === 'shape';
  }

  public convert(svgObject: ShapeArtboard, parent: XMLNode, defs: XMLNode, options: Options): XMLNode {
    let node: XMLNode;
    const shape = svgObject.shape;

    if (this.shapeIsCompound(shape) && !options.preferCompoundPath) {
      node = parent.element('g');
      return createElem(shape, node, defs, options);
    }

    node = createShape(shape, parent);
    this.applyBorderRadius(svgObject, shape, defs);

    return node;
  }

  private shapeIsCompound(shape: Shape): shape is CompoundPath {
    return shape.type === 'compound';
  }

  private applyBorderRadius(svgObject: Artboard, shape: Shape, defs: XMLNode): void {
    if (!(this.isRectangle(shape) && shape.r)) return;

    const { width, height, r } = shape;
    const ref = `clip-path-${width}-${height}-${r.join('-')}`;

    this.createClipPath({ width, height, r }, ref, defs);

    svgObject.style = {
      ...svgObject.style,
      clipPath: { ref },
    };
  }

  private isRectangle(shape: Shape): shape is Rectangle {
    return shape.type === 'rect';
  }

  private createClipPath({ width, height, r }: SvgRectToClipPath, id: string, defs: XMLNode): void {
    const maxBR = Math.min(width, height) / 2;

    const clipPath = svgRectToClipPath({
      height,
      r: this.getR(r, maxBR),
      width,
    }, defs);

    clipPath.attribute('id', id);
  }

  private getR(r, maxBR): number[] {
    return [
      Math.min(r[0], maxBR),
      Math.min(r[1], maxBR),
      Math.min(r[2], maxBR),
      Math.min(r[3], maxBR),
    ];
  }
}
