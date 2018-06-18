/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

export interface State {
  snap: boolean;
  origin: Array<() => number>;
  colspec: string;
  rowspec: string;
  pointerEvents: boolean;
  help: boolean;
}
