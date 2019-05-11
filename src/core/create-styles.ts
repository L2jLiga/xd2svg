/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLNode } from 'xmlbuilder';
import { Dictionary }          from '../common';
import { bold, red }           from '../utils';
import parsers                 from './styles';
import { Parser }              from './styles/models';

export function createStyles(stylesSrc: Dictionary<any> = {}, defs: XMLNode): string {
  const styleAttr: string[] = [];

  Object.getOwnPropertyNames(stylesSrc).map((styleName: string) => {
    const parser = parsers[styleName];

    if (!parser) return console.warn(`${bold(red('Styles converter:'))} unknown style given: %j`, stylesSrc[styleName]);

    styleAttr.push(...createStyle(parser, stylesSrc[styleName], defs));
  });

  return styleAttr.join('; ');
}

const toFormatted = (rule: string): string => rule.split(':').map((val: string) => val.trim()).join(': ');

function createStyle(parser: Parser, rawStyle: any, defs: XMLNode): string[] {
  const rule: string[] = [];

  const parserResult: string[] = parser.parse(rawStyle, defs).split(';');

  if (!parserResult[0].length) return [];

  if (parser.name) rule.push(parser.name);
  rule.push(parserResult.shift().trim());

  return [rule.join(': '), ...parserResult.map(toFormatted)];
}
