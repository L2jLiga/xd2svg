/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as builder                             from 'xmlbuilder';
import { XMLElementOrXMLNode }                  from 'xmlbuilder';
import * as logger                              from '../utils/logger';
import { createShape, createText }              from './converters';
import { createStyles }                         from './create-styles';
import { Artboard, ArtboardInfo, Shape }        from './models';
import { applyIfPossible }                      from './utils';
import { SvgRectToClipPath, svgRectToClipPath } from './utils/svg-rect-to-clip-path';

export function artboardConverter(artboardsRoot: Artboard, artboardInfo: ArtboardInfo): string[] {
  return artboardsRoot.children.map(toArtboards(artboardInfo));
}

function toArtboards(artboardInfo: ArtboardInfo) {
  return (root: Artboard): string => {
    const svg = builder.begin().element('svg', {
      'enable-background': `new ${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`,
      'id': `${root.id}`,
      'viewBox': `${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`,
    });
    applyIfPossible(svg, 'width', artboardInfo.width);
    applyIfPossible(svg, 'height', artboardInfo.height);

    svg.element('title', {}, artboardInfo.name);

    svg.element('rect', {
      height: `${artboardInfo.height}`,
      style: createStyles(root.style, svg),
      transform: `translate(${artboardInfo.x} ${artboardInfo.y})`,
      width: `${artboardInfo.width}`,
      x: 0,
      y: 0,
    });

    const defs = svg.element('defs');

    return createElem(root.artboard, svg, defs).end();
  };
}

function createTransforms(src): string {
  return `matrix(${src.a}, ${src.b}, ${src.c}, ${src.d}, ${src.tx}, ${src.ty})`;
}

export function createElem(svgObjCollection: Artboard, parentElement: XMLElementOrXMLNode, defs: XMLElementOrXMLNode): XMLElementOrXMLNode {
  svgObjCollection.children
    .map((svgObject: Artboard): void => {
      let node: XMLElementOrXMLNode;

      switch (svgObject.type) {
        case 'shape':
          const shape = svgObject.shape;
          node = createShape(svgObject.shape, parentElement);
          applyBorderRadius(svgObject, shape, defs);
          break;

        case 'text':
          node = createText(svgObject.text, parentElement);
          break;

        case 'group':
          node = parentElement.element('g');
          createElem(svgObject.group, node, defs);
          break;

        default:
          console.warn(`${logger.bold(logger.red('Create element:'))} unknown type: %j`, svgObject);
          return;
      }

      applyAttributes(node, defs, svgObject);
    });

  return parentElement;
}

function applyBorderRadius(svgObject: Artboard, shape: Shape, defs: XMLElementOrXMLNode) {
  if (shape.type === 'rect' && shape.r) {
    const {width, height, r} = shape;
    const ref = `clip-path-${width}-${height}-${r.join('-')}`;

    createClipPath({width, height, r}, ref, defs);

    svgObject.style = svgObject.style || {};
    svgObject.style.clipPath = {ref};
  }
}

function createClipPath(data: SvgRectToClipPath, id: string, defs: XMLElementOrXMLNode) {
  const {width, height, r} = data;
  const maxBR = Math.min(width, height) / 2;

  const clipPath = svgRectToClipPath({
    height,
    r: [
      Math.min(r[0], maxBR),
      Math.min(r[1], maxBR),
      Math.min(r[2], maxBR),
      Math.min(r[3], maxBR),
    ],
    width,
  }, defs);

  clipPath.attribute('id', id);
}

function applyAttributes(node: XMLElementOrXMLNode, defs: XMLElementOrXMLNode, svgObject: Artboard) {
  applyIfPossible(node, 'id', svgObject.id);
  applyIfPossible(node, 'name', svgObject.name);

  if (svgObject.visible === false) {
    svgObject.style ? svgObject.style.display = 'none' : svgObject.style = {display: 'none'};
  }

  if (svgObject.style) {
    node.attribute('style', createStyles(svgObject.style, defs));
  }

  if (svgObject.transform) {
    node.attribute('transform', createTransforms(svgObject.transform));
  }
}
