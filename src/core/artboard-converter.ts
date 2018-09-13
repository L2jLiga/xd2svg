/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as builder                                             from 'xmlbuilder';
import { XMLElementOrXMLNode }                                  from 'xmlbuilder';
import { createStyles }                                         from './create-styles';
import { Artboard, ArtboardInfo, Line, Paragraph, Shape, Text } from './models';

export function artboardConverter(artboardsRoot: Artboard, artboardInfo: ArtboardInfo): string[] {
  return artboardsRoot.children
    .map((imageRootObject: Artboard): string => {
      const svg = builder.begin().element('svg', {
        'enable-background': `new ${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`,
        'id': `${imageRootObject.id}`,
        'viewBox': `${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`,
      });
      if (artboardInfo.width) svg.attribute('width', `${artboardInfo.width}`);
      if (artboardInfo.height) svg.attribute('height', `${artboardInfo.height}`);

      svg.element('title', {}, artboardInfo.name);

      svg.element('rect', {
        height: `${artboardInfo.height}`,
        style: createStyles(imageRootObject.style, svg, imageRootObject.id),
        transform: `translate(${artboardInfo.x} ${artboardInfo.y})`,
        width: `${artboardInfo.width}`,
        x: 0,
        y: 0,
      });

      const defs = svg.element('defs');

      return createElem(imageRootObject.artboard, svg, defs).end();
    });
}

function createShape(srcObj: Shape, parentElement: XMLElementOrXMLNode, defs: XMLElementOrXMLNode) {
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

      if (srcObj.r) {
        shape.attribute('rx', srcObj.r[0]);
        shape.attribute('ry', srcObj.r[1]);
      }
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
      console.warn('Currently unsupported shape type:\n\n%O', srcObj);
  }

  return shape;
}

function createText(srcObj: Text, parentElement: XMLElementOrXMLNode) {
  const svgTextElement = parentElement.element('text');
  const rawText = srcObj.rawText;

  srcObj.paragraphs.map((paragraph: Paragraph) => {
    paragraph.lines.map((line: Line[]) => {
      line.map((linePart: Line) => {
        const element: XMLElementOrXMLNode = svgTextElement.element(
          'tspan',
          {},
          rawText.substring(linePart.from, linePart.to));

        if (linePart.x !== undefined) {
          element.attribute('x', `${linePart.x || 0}`);
        }

        if (linePart.y !== undefined) {
          element.attribute('y', `${linePart.y || 0}`);
        }
      });
    });
  });

  return svgTextElement;
}

function createTransforms(src): string {
  return `matrix(${src.a}, ${src.b}, ${src.c}, ${src.d}, ${src.tx}, ${src.ty})`;
}

export function createElem(svgObjCollection: { children: Artboard[] }, parentElement: XMLElementOrXMLNode, defs: XMLElementOrXMLNode): XMLElementOrXMLNode {
  svgObjCollection.children
    .map((svgObject: Artboard): void => {
      let node: XMLElementOrXMLNode;

      switch (svgObject.type) {
        case 'shape':
          node = createShape(svgObject.shape, parentElement, defs);
          break;

        case 'text':
          node = createText(svgObject.text, parentElement);
          break;

        case 'group':
          node = parentElement.element('g');
          createElem(svgObject.group, node, defs);
          break;

        default:
          console.warn(`%cWarning: %cUnsupported type: %O`, 'color: darkorange;', 'color: orange', svgObject);
          return;
      }

      applyAttributes(node, defs, svgObject);
    });

  return parentElement;
}

function applyAttributes(node: XMLElementOrXMLNode, defs: XMLElementOrXMLNode, svgObject: Artboard) {
  if (svgObject.id) {
    node.attribute('id', svgObject.id);
  }

  if (svgObject.name) {
    node.attribute('name', svgObject.name);
  }

  if (svgObject.visible === false) {
    svgObject.style ? svgObject.style.display = 'none' : svgObject.style = {display: 'none'};
  }

  if (svgObject.style) {
    node.attribute('style', createStyles(svgObject.style, defs, svgObject.id));
  }

  if (svgObject.transform) {
    node.attribute('transform', createTransforms(svgObject.transform));
  }
}
