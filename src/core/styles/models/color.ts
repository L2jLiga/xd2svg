/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

export interface Color {
  mode?: string;
  alpha?: number;
  value?: {
    r?: number;
    g?: number;
    b?: number;
    h?: number;
    s?: number;
    l?: number;
  };
}
