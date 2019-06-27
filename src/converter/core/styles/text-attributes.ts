/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { Parser, TextAttributes } from './models';

export const textAttributes: Parser = {
  parse: textAttributesParser,
};

function textAttributesParser(src: TextAttributes): string {
  const textAttrsStyles: string[] = [];

  if (src.lineHeight) textAttrsStyles.push(`line-height: ${src.lineHeight}px`);

  if (src.paragraphAlign) textAttrsStyles.push(`text-align: ${src.paragraphAlign}`);

  if (src.letterSpacing) textAttrsStyles.push(`letter-spacing: ${src.letterSpacing / 1000}em`);

  return textAttrsStyles.join(';');
}
