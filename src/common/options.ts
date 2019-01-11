/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

export interface Options {
  single?: boolean;
  prettyPrint?: boolean;
  preferCompoundPath?: boolean;
}

export interface SingleOutput extends Options {
  single: true;
}

export interface MultipleOutput extends Options {
  single: false;
}

export const defaultOptions: Options = {
  preferCompoundPath: true,
  prettyPrint: false,
  single: false,
};
