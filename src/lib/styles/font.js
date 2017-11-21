'use strict';

const fontWeightVariants = {
  Light: 300,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  Black: 900,
};

module.exports = function font(font) {
  const fontStyle = fontWeightVariants[font.style];

  return `;font-family:${font.family}
  ;font-size:${font.size}px
  ;font-weight:${fontStyle}`;
};
