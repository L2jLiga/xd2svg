'use strict';

import fill from './fill';

export default {
  name: 'stroke',
  parse: stroke
}


/**
 * Generate stroke style property from object
 * @param {Object} stroke - Object representing stroke properties
 * @param {Element} parentElement - Element which contain target element
 * @param {String} uuid - Unique identifier for element
 * @param {Object} resources - Object representing images for patterns
 * @return {String} String representing stroke style properties
 */
function stroke(stroke, parentElement, uuid, resources) {
  return fill.parse(stroke, parentElement, uuid, resources) + `;stroke-width:${stroke.width}px`;
}
