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
  x: string;
  y: string;
  width: string;
  height: string;
}

interface Circle {
  type: 'circle';
  cx: string;
  cy: string;
  r: string;
}

interface Ellipse {
  type: 'ellipse';
  cx: string;
  cy: string;
  rx: string;
  ry: string;
}

interface Line {
  type: 'line';
  x1: string;
  y1: string;
  x2: string;
  y2: string;
}

export type Shape = Path | CompoundPath | Rectangle | Circle | Ellipse | Line;
