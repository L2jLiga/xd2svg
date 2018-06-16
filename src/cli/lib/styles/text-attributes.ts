import { Parser } from './index';

export const textAttributes: Parser = {
  parse: textAttributesParser,
};

interface TextAttributes {
  lineHeight: number;
  paragraphAlign: string;
}

function textAttributesParser(src: TextAttributes): string {
  let textAttrsStyles: string = '';

  if (src.lineHeight) textAttrsStyles += `;line-height: ${src.lineHeight}px`;

  if (src.paragraphAlign) textAttrsStyles += `;text-align: ${src.paragraphAlign}`;

  return textAttrsStyles;
}
