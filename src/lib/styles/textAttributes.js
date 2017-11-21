'use strict';

module.exports = textAttributes;

/**
 * Generate filter text attributes properties from object
 * @param {Object} textAttributes - Object representing text attributes
 * @return {String} Attributes coverted to css inline-style string
 */
function textAttributes(textAttributes) {
  let textAttrsStyles = '';

  if (textAttributes.lineHeight) textAttrsStyles += `;line-height: ${textAttributes.lineHeight}px`;

  if (textAttributes.paragraphAlign) textAttrsStyles += `;text-align: ${textAttributes.paragraphAlign}`;

  return textAttrsStyles;
}
