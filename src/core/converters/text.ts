/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLElementOrXMLNode }   from 'xmlbuilder';
import { Line, Paragraph, Text } from '../models';
import { applyIfPossible }       from '../utils';

export class TextConverter {
  public static createText(srcObj: Text, parentElement: XMLElementOrXMLNode) {
    return new TextConverter(srcObj, parentElement);
  }

  public result: XMLElementOrXMLNode;
  private rawText: string;
  private source: Text;
  private parent: XMLElementOrXMLNode;

  constructor(srcObj: Text, parentElement: XMLElementOrXMLNode) {
    this.source = srcObj;
    this.parent = parentElement;

    this.rawText = this.source.rawText.replace(/ /g, '\u00A0');

    this.result = this.parent.element('text');

    this.source.paragraphs.forEach(this.toLines.bind(this));
  }

  private toLines = (paragraph: Paragraph) => paragraph.lines.forEach(this.toLine);

  private toLine = (line: Line[]) => line.forEach(this.toTextPart);

  private toTextPart = (line: Line): void => {
    const element: XMLElementOrXMLNode = this.result
      .element('tspan')
      .raw(this.rawText.substring(line.from, line.to));

    applyIfPossible(element, 'x', line.x);
    applyIfPossible(element, 'y', line.y);
  }
}
