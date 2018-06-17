/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { Artboard, Line, Paragraph, Shape, Text } from '../models/artboard';
import { ArtboardInfo } from '../models/artboard-info';
import { createStyles } from './create-styles';
import { document } from './utils/global-namespace';

export function artboardConverter(artboardsRoot: Artboard, artboardInfo: ArtboardInfo, resources: { [path: string]: string }): string[] {
  const svgImages: string[] = [];

  artboardsRoot.children
    .map((imageRootObject: Artboard): void => {
      const svg: Element = createNativeSvgElement('svg', {
        'enable-background': `new ${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`,
        'id': imageRootObject.id,
        'viewBox': `${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`,
      });
      if (artboardInfo.viewportWidth) svg.setAttribute('width', `${artboardInfo.viewportWidth}`);
      if (artboardInfo.viewportHeight) svg.setAttribute('height', `${artboardInfo.viewportHeight}`);

      const title: Element = createNativeSvgElement('title');
      title.innerHTML = artboardInfo.name;
      svg.appendChild(title);

      const backGround: Element = createNativeSvgElement('rect', {
        height: artboardInfo.height,
        style: createStyles(imageRootObject.style, svg, imageRootObject.id, resources),
        transform: `translate(${artboardInfo.x} ${artboardInfo.y})`,
        width: artboardInfo.width,
        x: 0,
        y: 0,
      });
      svg.appendChild(backGround);

      svgImages.push(createElem(imageRootObject.artboard, svg, resources).outerHTML);
    });

  return svgImages;
}

function createShape(srcObj: Shape): Element {
  const object = createNativeSvgElement(srcObj.type);

  switch (srcObj.type) {
    case 'path':
      object.setAttribute('d', srcObj.path);
      break;

    case 'rect':
      object.setAttribute('x', srcObj.x);
      object.setAttribute('y', srcObj.y);
      object.setAttribute('width', srcObj.width);
      object.setAttribute('height', srcObj.height);
      break;

    case 'circle':
      object.setAttribute('cx', srcObj.cx);
      object.setAttribute('cy', srcObj.cy);
      object.setAttribute('r', srcObj.r);
      break;

    default:
      console.warn('Currently unsupported shape type "%s":\n\n%O', srcObj.type, srcObj);
  }

  return object;
}

function createText(srcObj: Text): SVGElement {
  const svgTextElement: SVGElement = createNativeSvgElement('text');
  const rawText = srcObj.rawText;

  srcObj.paragraphs.map((paragraph: Paragraph) => {
    paragraph.lines.map((line: Line[]) => {
      line.map((linePart: Line) => {
        const element: SVGElement = createNativeSvgElement('tspan');

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

/* TODO: Parse another transformations */
function createTransforms(src): string {
  return `translate(${src.tx}, ${src.ty})`;
}

export function createElem<T extends Element>(svgObjCollection: Artboard, parentElement: T, resources: { [path: string]: string }): T {
  svgObjCollection.children
    .map((svgObject: Artboard): void => {
      let node: Element;

      switch (svgObject.type) {
        case 'shape':
          node = createShape(svgObject.shape);
          break;

        case 'text':
          node = createText(svgObject.text);
          break;

        case 'group':
          node = createNativeSvgElement('g');
          createElem(svgObject.group, node, resources);
          break;

        default:
          console.warn(`%cWarning: %cUnsupported type: ${svgObject.type}`, 'color: darkorange;', 'color: orange');
          return;
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

function createNativeSvgElement(tagName: string, attrs: {} = {}): SVGElement {
  const svgElement = document.createElementNS('http://www.w3.org/2000/svg', tagName);

  Object.keys(attrs).map((attr: string) => {
    svgElement.setAttribute(attr, attrs[attr]);
  });

  return svgElement;
}
