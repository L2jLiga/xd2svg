/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

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
  x?: number;
  y?: number;
}
