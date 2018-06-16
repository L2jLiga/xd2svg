/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

export interface Artboard {
  id: string;
  children: Artboard[];
  type: string;
  artboard?: Artboard;
  shape?: Shape;
  text?: Text;
  group?: Artboard;
  style: { [style: string]: any };
  transform: { [transform: string]: any };
}

export interface Shape {
  type: string;

  /* Path */
  path?: string;

  /* Rectangle */
  x: string;
  y: string;
  width: string;
  height: string;

  /* Circle */
  cx: string;
  cy: string;
  r: string;
}

export interface Text {
  rawText: string;
  paragraphs: Paragraph[];
}

export interface Paragraph {
  lines: Line[][];
}

export interface Line {
  from: number;
  to: number;
  x: number;
  y: number;
}
