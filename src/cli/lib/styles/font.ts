import { Parser } from "./index";

const fontWeightVariants = {
  Light: 300,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  Black: 900,
};

const fontParser: Parser = {parse: font};

/**
 * Generate font style property from object
 * @param {Object} font - Object representing font properties
 * @return {String} String representing font style properties
 */
function font(font) {
  const fontStyle = fontWeightVariants[font.style];

  return `;font-family:${font.family}
  ;font-size:${font.size}px
  ;font-weight:${fontStyle}`;
}

export default fontParser;
