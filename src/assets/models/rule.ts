/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

export interface Rule {
  setPosition: (pos: () => number, label?: string) => void;
  refresh: () => void;
  copyPosition: (rule) => void;
  remove: () => void;
  isVertical: boolean;
  loupeRule: Element;
  rule: Element;
  pos?: () => number;
  poslabel: Element;
  difflabel: Element;
  id: string | number;
  text?: string;
  p?: any;
}
