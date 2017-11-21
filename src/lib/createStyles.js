'use strict';

const parsers = {
  fill: {
    name: 'fill',
    parse: require('./styles/fill'),
  },
  stroke: {
    name: 'stroke',
    parse: require('./styles/stroke'),
  },
  filters: {
    name: 'filter',
    parse: require('./styles/filters'),
  },
  opacity: {
    name: 'opacity',
    parse: (opacity) => opacity,
  },
  textAttributes: {
    name: '',
    parse: require('./styles/textAttributes'),
  },
  font: {
    name: '',
    parse: require('./styles/font'),
  },
};
const supportedStyles = Object.keys(parsers);

module.exports = createStyles;

/**
 * Create value for style attr from object
 * @param {Object} stylesObject - Object representing styles
 * @param {Element} parrentElement - Element which contain target element
 * @param {String} uuid - Unique identifier for element
 * @param {Object} resources - Object representing images for patterns
 * @return {String} String representing styles
 */
function createStyles(stylesObject, parrentElement, uuid, resources) {
  let styleAttr = '';

  supportedStyles.forEach((styleName) => {
    if (!stylesObject[styleName]) return;

    const parser = parsers[styleName];

    const ruleName = parser.name ? parser.name + ':' : '';
    const ruleValue = parser.parse(stylesObject[styleName], parrentElement, uuid, resources);

    styleAttr += `;${ruleName + ruleValue};`;
  });

  return styleAttr;
}
