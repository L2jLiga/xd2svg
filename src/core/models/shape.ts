/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */
import { Artboard } from './artboard';

interface Path {
  type: 'path';
  path: string;
}

interface CompoundPath {
  type: 'compound';
  path: string;
  children: Artboard[];
}

interface Rectangle {
  type: 'rect';
  x: number;
  y: number;
  r?: number[];
  width: number;
  height: number;
}

interface Circle {
  type: 'circle';
  cx: number;
  cy: number;
  r: number;
}

interface Ellipse {
  type: 'ellipse';
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

interface Line {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export type Shape = Path | CompoundPath | Rectangle | Circle | Ellipse | Line;
