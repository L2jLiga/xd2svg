const context = new (require('jsdom').JSDOM);
const createColor = require('./color-transformer');

module.exports = artboardConverter.bind(context.window, context.window.document);

/**
 * Convert all artboards element to one svg image
 * @param {Document} document - Document
 * @param {Object} artboard - Current artboard for convertation
 * @param {Object} artboardInfo - Information about current artboard
 * @return {String[]} Array of serialized svgs
 */
function artboardConverter(document, artboard, artboardInfo) {
  'use strict';

  let svgImages = [];

  artboard.children.forEach(convertArtboardToSVG);

  return svgImages;

  /**
   * Create shape element
   * TODO: Concat with `createText` function
   * @param {Object} pathObject - Object representing shape element
   * @returns {Element} Shape element
   */
  function createShape(pathObject) {
    let object = document.createElementNS('http://www.w3.org/2000/svg', pathObject.type);

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
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    let rawText = textObject.rawText;

    textObject.paragraphs.forEach(function (paragraph) {
      paragraph.lines.forEach(function (line) {
        line.forEach(function (linePart) {
          let line = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');

          line.innerHTML = rawText.substring(linePart.from, linePart.to);

          line.setAttribute('x', linePart.x || 0);

          line.setAttribute('y', linePart.y || 0);

          text.appendChild(line);
        });
      });
    });

    return text;
  }

  /**
   * Generate styles property for node
   * TODO: Make it universal
   * @param {Element} node - Element which should be stylized
   * @param {Object} stylesObject - Styles for element
   * @return {void}
   */
  function generateStyles(node, stylesObject) {
    if (stylesObject.fill) {
      if (stylesObject.fill.type !== 'none') {
        node.setAttribute('fill', createColor(stylesObject.fill.color));
      } else {
        node.setAttribute('fill', 'none');
      }
    }

    if (stylesObject.stroke) {
      if (stylesObject.stroke.type !== 'none') {
        node.setAttribute('stroke', createColor(stylesObject.stroke.color));

        node.setAttribute('stroke-width', stylesObject.stroke.width);
      } else {
        node.setAttribute('stroke', 'none');
      }
    }

    if (stylesObject.font) {
      // TODO: font style oblique/italic/bold/semibold and others....
      let fontStyle = ';font:' + (stylesObject.font.size || 16) + 'px ' + stylesObject.font.style + ' ' + stylesObject.font.family

        + ';font-family:' + stylesObject.font.family
        + ';font-size:' + stylesObject.font.size + 'px'

        + ';font-style:' + stylesObject.font.style
        + ';font-weight:' + stylesObject.font.style;

      node.setAttribute('style', fontStyle);
    }
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
    svgObjCollection.children.forEach(function (svgObject) {
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
        generateStyles(node, svgObject.style);
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
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    let backGround = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    title.innerHTML = artboardInfo.name;

    backGround.setAttribute('width', artboardInfo.width);
    backGround.setAttribute('height', artboardInfo.height);
    generateStyles(backGround, imageRootObject.style);

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