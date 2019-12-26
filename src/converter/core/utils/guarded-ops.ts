/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLNode } from 'xmlbuilder';

export function applyIfPossible(node: XMLNode, attribute: string, value: any): void {
  if (!isNil(value) && !isEmptyString(value)) {
    node.attribute(attribute, value);
  }
}

function isEmptyString(value: any): boolean {
  return value === '';
}

export function isNil(value: any): boolean {
  return value === null || value === undefined;
}
