'use strict';

module.exports = colorTransformer;

/**
 * Convert color from color object to string
 * TODO: Add support for another modes
 * @param {Object} fillColor - Color object
 * @return {String} Created color
 */
function colorTransformer(fillColor) {
  let color;

  if (!fillColor) return 'white';

  switch (fillColor.mode) {
    case 'RGB':
      if (fillColor.alpha) {
        return 'rgba(' + fillColor.value.r + ',' + fillColor.value.g + ',' + fillColor.value.b + ',' + fillColor.alpha + ')';
      } else {
        return 'rgb(' + fillColor.value.r + ',' + fillColor.value.g + ',' + fillColor.value.b + ')';
      }
    case 'HSL':
      if (fillColor.alpha) {
        return 'hsla(' + fillColor.value.h + ',' + fillColor.value.s + ',' + fillColor.value.l + ',' + fillColor.alpha + ')';
      } else {
        return 'hsl(' + fillColor.value.h + ',' + fillColor.value.s + ',' + fillColor.value.l + ')';
      }
  }

  return color;
}
