import { Artboard, Line, Paragraph, Shape, Text } from '../models/artboard';
import { ArtboardInfo } from '../models/artboard-info';
import createStyles from './create-styles';
import { document } from './utils/global-namespace';

export default function artboardConverter(artboardsRoot: Artboard, artboardInfo: ArtboardInfo, resources: { [path: string]: string }): string[] {
  const svgImages: string[] = [];

  artboardsRoot.children
    .forEach((imageRootObject: Artboard): void => {
        const svg: Element = createNativeSvgElement('svg');
        const title: Element = createNativeSvgElement('title');
        const backGround: Element = createNativeSvgElement('rect');

        title.innerHTML = artboardInfo.name;

        backGround.setAttribute('x', '0');
        backGround.setAttribute('y', '0');
        backGround.setAttribute('transform', `translate(${artboardInfo.x} ${artboardInfo.y})`);
        backGround.setAttribute('width', `${artboardInfo.width}`);
        backGround.setAttribute('height', `${artboardInfo.height}`);
        backGround.setAttribute('style', createStyles(imageRootObject.style, svg, imageRootObject.id, resources));

        svg.setAttribute('id', imageRootObject.id);
        svg.setAttribute('viewBox', `${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`);
        svg.setAttribute('enable-background', `new ${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`);
        if (artboardInfo.viewportWidth) svg.setAttribute('width', `${artboardInfo.viewportWidth}`);
        if (artboardInfo.viewportHeight) svg.setAttribute('height', `${artboardInfo.viewportHeight}`);
        svg.appendChild(title);
        svg.appendChild(backGround);

        svgImages.push(createElem(imageRootObject.artboard, svg, resources).outerHTML);
      },
    );

  return svgImages;
}

function createShape(srcObj: Shape): Element {
  const object = createNativeSvgElement(srcObj.type);

  if (srcObj.type === 'path') {
    object.setAttribute('d', srcObj.path);
  } else if (srcObj.type === 'rect') {
    object.setAttribute('x', srcObj.x);
    object.setAttribute('y', srcObj.y);
    object.setAttribute('width', srcObj.width);
    object.setAttribute('height', srcObj.height);
  } else if (srcObj.type === 'circle') {
    object.setAttribute('cx', srcObj.cx);
    object.setAttribute('cy', srcObj.cy);
    object.setAttribute('r', srcObj.r);
  }

  return object;
}

function createText(srcObj: Text): Element {
  const svgTextElement: Element = createNativeSvgElement('text');
  const rawText = srcObj.rawText;

  srcObj.paragraphs.forEach((paragraph: Paragraph) => {
    paragraph.lines.forEach((line: Line[]) => {
      line.forEach((linePart: Line) => {
        const element: Element = createNativeSvgElement('tspan');

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
    .forEach((svgObject: Artboard): void => {
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

function createNativeSvgElement(tagName: string): Element {
  return document.createElementNS('http://www.w3.org/2000/svg', tagName);
}
