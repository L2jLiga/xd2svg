'use strict';

const document = new (require('jsdom').JSDOM)().window.document;
const colorTransformer = require('./colorTransformer');

module.exports = function fill(fill, parentElement, uuid, resources) {
  switch (fill.type) {
    case 'color':
      return colorTransformer(fill.fill.color);
    case 'gradient':
      return `url(#${fill.gradient.ref})`;
    case 'pattern':
      parentElement.appendChild(createPattern(uuid, resources, fill.pattern));

      return `url(#${uuid})`;
    case 'none':
      return 'none';
    default:
      return colorTransformer(fill.color);
  }
};

/**
 * Create pattern for image fill
 * @param {String} uuid - Unique identificator of pattern
 * @param {Object} resources - Object representing images for pattern
 * @param {Object} patternObject - Object representing pattern
 * @return {Element} Created pattern
 */
function createPattern(uuid, resources, patternObject) {
  const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
  const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');

  pattern.setAttribute('id', uuid);

  image.setAttribute('xlink:href', resources[patternObject.meta.ux.uid]);
  image.setAttribute('width', patternObject.width);
  image.setAttribute('height', patternObject.height);

  pattern.appendChild(image);

  return pattern;
}
