/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLNode }        from 'xmlbuilder';
import { fillParser }     from './fill';
import { Parser, Stroke } from './models';

export const stroke: Parser = {
  name: 'stroke',
  parse: strokeParser,
};

function strokeParser(src: Stroke, parentElement: XMLNode): string {
  const styles: string[] = [];
  styles.push(fillParser(src, parentElement));

  if (src.width) styles.push(`stroke-width:${src.width}px`);
  if (src.dash) styles.push(`stroke-dasharray:${src.dash.join(' ')}`);
  if (src.cap) styles.push(`stroke-linecap: ${src.cap}`);
  if (src.join) styles.push(`stroke-linejoin: ${src.join}`);

  return styles.filter(Boolean).join(';');
}
