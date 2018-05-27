'use strict';

const context = new (require('jsdom').JSDOM)();
import createStyles from './createStyles';

export default artboardConverter.bind(context.window, context.window.document);

/**
 * Convert all artboards element to one svg image
 * @param {Document} document - Document
 * @param {Object} artboard - Current artboard for convertation
 * @param {Object} artboardInfo - Information about current artboard
 * @param {Object} resources - Object representing graphics resources
 * @return {String[]} Array of serialized svgs
 */
function artboardConverter(document, artboard, artboardInfo, resources) {
  const svgImages = [];
  const patterns = [];

  artboard.children.forEach(convertArtboardToSVG);

  svgImages.unshift(`${patterns.join('\r\n')}`);

  return svgImages;

  /**
   * Create shape element
   * TODO: Concat with `createText` function
   * @param {Object} pathObject - Object representing shape element
   * @return {Element} Shape element
   */
  function createShape(pathObject) {
    const object = document.createElementNS('http://www.w3.org/2000/svg', pathObject.type);

    if (pathObject.type === 'path') {
      object.setAttribute('d', pathObject.path);
    } else if (pathObject.type === 'rect') {
      object.setAttribute('x', pathObject.x);
      object.setAttribute('y', pathObject.y);
      object.setAttribute('width', pathObject.width);
      object.setAttribute('height', pathObject.height);
    } else if (pathObject.type === 'circle') {
      object.setAttribute('cx', pathObject.cx);
      object.setAttribute('cy', pathObject.cy);
      object.setAttribute('r', pathObject.r);
    }

    return object;
  }

  /**
   * Create text element
   * @param {Object} textObject - Object representing text element
   * @return {Element} Text element
   */
  function createText(textObject) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const rawText = textObject.rawText;

    textObject.paragraphs.forEach((paragraph) => {
      paragraph.lines.forEach((line) => {
        line.forEach((linePart) => {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');

          line.innerHTML = rawText.substring(linePart.from, linePart.to);

          if (linePart.x !== undefined) line.setAttribute('x', linePart.x || 0);

          if (linePart.y !== undefined) line.setAttribute('y', linePart.y || 0);

          text.appendChild(line);
        });
      });
    });

    return text;
  }

  /**
   * Transform element
   * @param {Element} node - Element which should be transformed
   * @param {Object} transformationObject - Object with transform values
   * @return {void}
   */
  function generateTransformations(node, transformationObject) {
    // TODO: write generator for obj
    node.setAttribute('transform', 'translate(' + transformationObject.tx + ' ' + transformationObject.ty + ')');
  }

  /**
   * Create svg elements
   * @param {Object[]} svgObjCollection - Array with objects which contains element info
   * @param {Element} parentElement - Parent element, which should contain this
   * @return {Element} parentElement
   */
  function createSvgElem(svgObjCollection, parentElement) {
    svgObjCollection.children.forEach((svgObject) => {
      let node;

      if (svgObject.type === 'shape') {
        node = createShape(svgObject.shape);
      } else if (svgObject.type === 'text') {
        node = createText(svgObject.text);
      } else if (svgObject.type === 'group') {
        node = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        createSvgElem(svgObject.group, node);
      }

      if (svgObject.style) {
        node.setAttribute('style', createStyles(svgObject.style, parentElement, svgObject.id, resources));
      }

      if (svgObject.transform) {
        generateTransformations(node, svgObject.transform);
      }

      parentElement.appendChild(node);
    });

    return parentElement;
  }

  /**
   * Convert artboard to SVG image and push it into `svgImages` array
   * @param {Object} imageRootObject - Object representing root element
   * @return {void}
   */
  function convertArtboardToSVG(imageRootObject) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    const backGround = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    title.innerHTML = artboardInfo.name;

    backGround.setAttribute('x', '0');
    backGround.setAttribute('y', '0');
    backGround.setAttribute('transform', `translate(${artboardInfo.x} ${artboardInfo.y})`);
    backGround.setAttribute('width', artboardInfo.width);
    backGround.setAttribute('height', artboardInfo.height);
    backGround.setAttribute('style', createStyles(imageRootObject.style, svg, imageRootObject.id, resources));

    svg.setAttribute('id', imageRootObject.id);
    svg.setAttribute('viewBox', `${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`);
    svg.setAttribute('enable-background', `new ${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`);
    artboardInfo.viewportWidth ? svg.setAttribute('width', artboardInfo.viewportWidth) : null;
    artboardInfo.viewportHeight ? svg.setAttribute('height', artboardInfo.viewportHeight) : null;
    svg.appendChild(title);
    svg.appendChild(backGround);

    svgImages.push(createSvgElem(imageRootObject.artboard, svg).outerHTML);
  }
}
