/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { createStyles }                                                       from './create-styles';
import { Artboard, ArtboardInfo, Line, Paragraph, ResourcesMap, Shape, Text } from './models';
import { createElement }                                                      from './utils/create-element';

export function artboardConverter(artboardsRoot: Artboard, artboardInfo: ArtboardInfo, resources: { [path: string]: string }): string[] {
  return artboardsRoot.children
    .map((imageRootObject: Artboard): string => {
      const svg = createElement('svg', {
        'enable-background': `new ${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`,
        'id': imageRootObject.id,
        'viewBox': `${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`,
      });
      if (artboardInfo.width) svg.setAttribute('width', `${artboardInfo.width}`);
      if (artboardInfo.height) svg.setAttribute('height', `${artboardInfo.height}`);

      const title = createElement('title');
      title.innerHTML = artboardInfo.name;
      svg.appendChild(title);

      const backGround = createElement('rect', {
        height: artboardInfo.height,
        style: createStyles(imageRootObject.style, svg, imageRootObject.id, resources),
        transform: `translate(${artboardInfo.x} ${artboardInfo.y})`,
        width: artboardInfo.width,
        x: 0,
        y: 0,
      });
      svg.appendChild(backGround);

      return createElem(imageRootObject.artboard, svg, resources).outerHTML;
    });
}

function createShape(srcObj: Shape, resources: ResourcesMap) {
  const object = createElement(srcObj.type === 'compound' ? 'path' : srcObj.type);

  switch (srcObj.type) {
    case 'compound':
      createElem(srcObj, object, resources);

    case 'path':
      object.setAttribute('d', srcObj.path);
      break;

    case 'rect':
      object.setAttribute('x', srcObj.x);
      object.setAttribute('y', srcObj.y);
      object.setAttribute('width', srcObj.width);
      object.setAttribute('height', srcObj.height);

      if (srcObj.r) {
        object.setAttribute('rx', srcObj.r[0]);
        object.setAttribute('ry', srcObj.r[1]);
      }
      break;

    case 'circle':
      object.setAttribute('cx', srcObj.cx);
      object.setAttribute('cy', srcObj.cy);
      object.setAttribute('r', srcObj.r);
      break;

    case 'ellipse':
      object.setAttribute('cx', srcObj.cx);
      object.setAttribute('cy', srcObj.cy);
      object.setAttribute('rx', srcObj.rx);
      object.setAttribute('ry', srcObj.ry);
      break;

    case 'line':
      object.setAttribute('x1', srcObj.x1);
      object.setAttribute('y1', srcObj.y1);
      object.setAttribute('x2', srcObj.x2);
      object.setAttribute('y2', srcObj.y2);
      break;

    default:
      console.warn('Currently unsupported shape type:\n\n%O', srcObj);
  }

  return object;
}

function createText(srcObj: Text) {
  const svgTextElement = createElement('text');
  const rawText = srcObj.rawText;

  srcObj.paragraphs.map((paragraph: Paragraph) => {
    paragraph.lines.map((line: Line[]) => {
      line.map((linePart: Line) => {
        const element: SVGElement = createElement('tspan');

        element.innerHTML = rawText.substring(linePart.from, linePart.to);

        if (linePart.x !== undefined) {
          element.setAttribute('x', `${linePart.x || 0}`);
        }

        if (linePart.y !== undefined) {
          element.setAttribute('y', `${linePart.y || 0}`);
        }

        svgTextElement.appendChild(element);
      });
    });
  });

  return svgTextElement;
}

function createTransforms(src): string {
  return `matrix(${src.a}, ${src.b}, ${src.c}, ${src.d}, ${src.tx}, ${src.ty})`;
}

export function createElem<T extends SVGElement>(svgObjCollection: { children: Artboard[] }, parentElement: T, resources: ResourcesMap): T {
  svgObjCollection.children
    .map((svgObject: Artboard): void => {
      let node: SVGElement;

      switch (svgObject.type) {
        case 'shape':
          node = createShape(svgObject.shape, resources);
          break;

        case 'text':
          node = createText(svgObject.text);
          break;

        case 'group':
          node = createElement('g');
          createElem(svgObject.group, node, resources);
          break;

        default:
          console.warn(`%cWarning: %cUnsupported type: %O`, 'color: darkorange;', 'color: orange', svgObject);
          return;
      }

      if (svgObject.id) {
        node.setAttribute('id', svgObject.id);
      }

      if (svgObject.name) {
        node.setAttribute('name', svgObject.name);
      }

      if (svgObject.style) {
        node.setAttribute('style', createStyles(svgObject.style, parentElement, svgObject.id, resources));
      }

      if (svgObject.transform) {
        node.setAttribute('transform', createTransforms(svgObject.transform));
      }

      parentElement.appendChild(node);
    });

  return parentElement;
}
