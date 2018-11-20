/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLElementOrXMLNode } from 'xmlbuilder';
import { Dictionary }          from '../common';
import { bold, red } from '../utils';
import parsers                 from './styles';

export function createStyles(stylesSrc: Dictionary<any>, defs: XMLElementOrXMLNode): string {
  const styleAttr: string[] = [];

  Object.getOwnPropertyNames(stylesSrc).map((styleName: string) => {
    const parser = parsers[styleName];

    if (!parser) return console.warn(`${bold(red('Styles converter:'))} unknown style given: %j`, stylesSrc[styleName]);

    const rule: string[] = [];

    const parserResult: string[] = parser.parse(stylesSrc[styleName], defs).split(';');

    if (!parserResult[0].length) return;
    if (parser.name) rule.push(parser.name);
    rule.push(parserResult.shift().trim());

    styleAttr.push(rule.join(': '));
    styleAttr.push(
      ...parserResult.map((result: string) => result.split(':').map((val: string) => val.trim()).join(': ')),
    );
  });

  return styleAttr.join('; ');
}
