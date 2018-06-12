import { Parser } from './index';

const textAttributesParser: Parser = {
  parse: textAttributes,
};

interface TextAttributes {
  lineHeight: number;
  paragraphAlign: string;
}

function textAttributes(src: TextAttributes): string {
  let textAttrsStyles: string = '';

  if (src.lineHeight) textAttrsStyles += `;line-height: ${src.lineHeight}px`;

  if (src.paragraphAlign) textAttrsStyles += `;text-align: ${src.paragraphAlign}`;

  return textAttrsStyles;
}

export default textAttributesParser;
