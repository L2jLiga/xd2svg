/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLElementOrXMLNode } from 'xmlbuilder';
import parsers                 from './styles';

export function createStyles(stylesSrc, defs: XMLElementOrXMLNode): string {
  let styleAttr: string = '';

  Object.getOwnPropertyNames(stylesSrc).map((styleName) => {
    const parser = parsers[styleName];
    const styleValue = stylesSrc[styleName];

    if (parser) {
      const ruleName: string = parser.name ? `${parser.name}: ` : '';
      const ruleValue: string = parser.parse(styleValue, defs);

      styleAttr += `;${ruleName} ${ruleValue};`;
    } else {
      console.warn('Unsupported style %s:\n\n%O', styleName, styleValue);
    }
  });

  return styleAttr;
}
