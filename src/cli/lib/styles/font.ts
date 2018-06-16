import { Parser } from './index';

// tslint:disable:object-literal-sort-keys
const fontWeightVariants = {
  Light: 300,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  Black: 900,
};
// tslint:enable:object-literal-sort-keys

export const font: Parser = {parse: fontParser};

export interface Font {
  style: string;
  family: string;
  size: string;
}

function fontParser(src: Font) {
  const fontStyle = fontWeightVariants[src.style];

  return `;font-family:${src.family}
  ;font-size:${src.size}px
  ;font-weight:${fontStyle}`;
}
