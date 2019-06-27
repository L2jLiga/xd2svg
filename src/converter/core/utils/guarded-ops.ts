/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLNode } from 'xmlbuilder';

export function applyIfPossible(node: XMLNode, attribute: string, value: any): void {
  if (value != null) {
    node.attribute(attribute, value);
  }
}
