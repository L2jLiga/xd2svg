/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { ClipPath, Parser } from './models';

export const clipPath: Parser = {
  name: 'clip-path',
  parse: clipPathParser,
};

function clipPathParser(src: ClipPath): string {
  return `url(#${src.ref})`;
}
