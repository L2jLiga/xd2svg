'use strict';

const fontWeightVariants = {
  Light: 300,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  Black: 900,
};

module.exports = function fontStyles(fontStyles) {
  const fontStyle = fontWeightVariants[fontStyles.style];

  return `;font-family:${fontStyles.family}
  ;font-size:${fontStyles.size}px
  ;font-weight:${fontStyle}`;
};
