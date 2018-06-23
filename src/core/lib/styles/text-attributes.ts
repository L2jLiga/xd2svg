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
  let textAttrsStyles: string = '';

  if (src.lineHeight) textAttrsStyles += `;line-height: ${src.lineHeight}px`;

  if (src.paragraphAlign) textAttrsStyles += `;text-align: ${src.paragraphAlign}`;

  return textAttrsStyles;
}
