/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as builder                                                           from 'xmlbuilder';
import { XMLElementOrXMLNode }                                                from 'xmlbuilder';
import { createStyles }                                                       from './create-styles';
import { Artboard, ArtboardInfo, Line, Paragraph, ResourcesMap, Shape, Text } from './models';

export function artboardConverter(artboardsRoot: Artboard, artboardInfo: ArtboardInfo, resources: { [path: string]: string }): string[] {
  return artboardsRoot.children
    .map((imageRootObject: Artboard): string => {
      const svg = builder.begin().element({
        svg: {
          '@enable-background': `new ${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`,
          '@id': `${imageRootObject.id}`,
          '@viewBox': `${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`,
        },
      });
      if (artboardInfo.width) svg.attribute('width', `${artboardInfo.width}`);
      if (artboardInfo.height) svg.attribute('height', `${artboardInfo.height}`);

      svg.element('title', {}, artboardInfo.name);

      svg.element('rect', {
        height: `${artboardInfo.height}`,
        style: createStyles(imageRootObject.style, svg, imageRootObject.id, resources),
        transform: `translate(${artboardInfo.x} ${artboardInfo.y})`,
        width: `${artboardInfo.width}`,
        x: 0,
        y: 0,
      });

      const defs = svg.element('defs');

      return createElem(imageRootObject.artboard, svg, defs, resources).end();
    });
}

function createShape(srcObj: Shape, resources: ResourcesMap, parentElement: XMLElementOrXMLNode, defs: XMLElementOrXMLNode) {
  const object = parentElement.element(srcObj.type === 'compound' ? 'path' : srcObj.type);

  switch (srcObj.type) {
    case 'compound':
      createElem(srcObj, object, defs, resources);

    case 'path':
      object.attribute('d', srcObj.path);
      break;

    case 'rect':
      object.attribute('x', srcObj.x);
      object.attribute('y', srcObj.y);
      object.attribute('width', srcObj.width);
      object.attribute('height', srcObj.height);

      if (srcObj.r) {
        object.attribute('rx', srcObj.r[0]);
        object.attribute('ry', srcObj.r[1]);
      }
      break;

    case 'circle':
      object.attribute('cx', srcObj.cx);
      object.attribute('cy', srcObj.cy);
      object.attribute('r', srcObj.r);
      break;

    case 'ellipse':
      object.attribute('cx', srcObj.cx);
      object.attribute('cy', srcObj.cy);
      object.attribute('rx', srcObj.rx);
      object.attribute('ry', srcObj.ry);
      break;

    case 'line':
      object.attribute('x1', srcObj.x1);
      object.attribute('y1', srcObj.y1);
      object.attribute('x2', srcObj.x2);
      object.attribute('y2', srcObj.y2);
      break;

    default:
      console.warn('Currently unsupported shape type:\n\n%O', srcObj);
  }

  return object;
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

export function createElem(
  svgObjCollection: { children: Artboard[] },
  parentElement: XMLElementOrXMLNode,
  defs: XMLElementOrXMLNode,
  resources: ResourcesMap,
): XMLElementOrXMLNode {
  svgObjCollection.children
    .map((svgObject: Artboard): void => {
      let node: XMLElementOrXMLNode;

      switch (svgObject.type) {
        case 'shape':
          node = createShape(svgObject.shape, resources, parentElement, defs);
          break;

        case 'text':
          node = createText(svgObject.text, parentElement);
          break;

        case 'group':
          node = parentElement.element('g');
          createElem(svgObject.group, node, defs, resources);
          break;

        default:
          console.warn(`%cWarning: %cUnsupported type: %O`, 'color: darkorange;', 'color: orange', svgObject);
          return;
      }

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
        node.attribute('style', createStyles(svgObject.style, defs, svgObject.id, resources));
      }

      if (svgObject.transform) {
        node.attribute('transform', createTransforms(svgObject.transform));
      }
    });

  return parentElement;
}
