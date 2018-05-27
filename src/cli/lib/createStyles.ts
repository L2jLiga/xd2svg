import parsers from './styles';

const supportedStyles = Object.keys(parsers);

/**
 * Create value for style attr from object
 * @param {Object} stylesObject - Object representing styles
 * @param {Element} parentElement - Element which contain target element
 * @param {String} uuid - Unique identifier for element
 * @param {Object} resources - Object representing images for patterns
 * @return {String} String representing styles
 */
export default function createStyles(stylesObject, parentElement, uuid, resources) {
  let styleAttr = '';

  supportedStyles.forEach((styleName) => {
    if (!stylesObject[styleName]) return;

    const parser = parsers[styleName];

    const ruleName = parser.name ? parser.name + ':' : '';
    const ruleValue = parser.parse(stylesObject[styleName], parentElement, uuid, resources);

    styleAttr += `;${ruleName + ruleValue};`;
  });



  return styleAttr;
}
