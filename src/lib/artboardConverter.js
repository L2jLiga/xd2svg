'use strict';

const context = new (require('jsdom').JSDOM)();
const createColor = require('./styles/colorTransformer');
const textAttributes = require('./styles/textAttributes');
const fontStyles = require('./styles/fontStyles');
const filtersStyle = require('./styles/filters');

module.exports = artboardConverter.bind(context.window, context.window.document);

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
   * Generate styles property for node
   * TODO: Make it universal
   * @param {Element} node - Element which should be stylized
   * @param {Object} stylesObject - Styles for element
   * @param {String} uuid - unique identifier of element
   * @return {void}
   */
  function generateStyles(node, stylesObject, uuid) {
    const colorStyles = ['stroke', 'fill'];

    if (stylesObject.textAttributes) {
      const currentStyleString = node.getAttribute('style') || '';
      const newStyleString = currentStyleString + textAttributes(stylesObject.textAttributes);

      node.setAttribute('style', newStyleString);
    }

    if (stylesObject.filters) node.setAttribute('filter', filtersStyle(stylesObject.filters));

    colorStyles.forEach((styleName) => {
      const styleObject = stylesObject[styleName];

      if (styleObject) {
        switch (styleObject.type) {
          case 'color':
            node.setAttribute(styleName, createColor(styleObject.fill.color));

            break;
          case 'gradient':
            node.setAttribute(styleName, `url(#${styleObject.gradient.ref})`);

            break;
          case 'pattern':
            // TODO: write to patterns new pattern with image and add it to defs in xd2svg
            patterns.push(`<pattern id="${uuid}"
                                    width="100%" height="100%">
                            <image xlink:href="${resources[styleObject.pattern.meta.ux.uid]}"
                                   width="${styleObject.pattern.width}" height="${styleObject.pattern.height}" />
                           </pattern>`);

            node.setAttribute(styleName, `url(#${uuid})`);

            break;
          case 'none':
            node.setAttribute(styleName, 'none');

            break;
          default:
            node.setAttribute(styleName, createColor(styleObject.color));
        }

        if (styleObject.width) node.setAttribute(styleName + '-width', styleObject.width);
      }
    });

    if (stylesObject.opacity) node.setAttribute('opacity', stylesObject.opacity);

    if (stylesObject.font) {
      const currentStyleString = node.getAttribute('style') || '';
      const newStyleString = currentStyleString + fontStyles(stylesObject.font);

      node.setAttribute('style', newStyleString);
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
        generateStyles(node, svgObject.style, svgObject.id);
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
