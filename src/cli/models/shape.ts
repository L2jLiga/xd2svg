/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

export interface Path {
  type: 'path';
  path: string;
}

export interface Rectangle {
  type: 'rect';
  x: string;
  y: string;
  width: string;
  height: string;
}

export interface Circle {
  type: 'circle';
  cx: string;
  cy: string;
  r: string;
}

export interface Ellipse {
  type: 'ellipse';
  cx: string;
  cy: string;
  rx: string;
  ry: string;
}

export type Shape = Path | Rectangle | Circle | Ellipse;
