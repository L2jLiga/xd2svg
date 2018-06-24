/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { ArtboardInfo } from './index';

export interface Resource {
  artboards: { [name: string]: ArtboardInfo };
  gradients: string;
  clipPaths: string;
}

export interface RawResource {
  path: string;
  type: string;
}

export interface ResourcesMap {
  [path: string]: string;
}
