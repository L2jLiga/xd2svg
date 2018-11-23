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

export function createText(srcObj: Text, parentElement: XMLElementOrXMLNode) {
  const svgTextElement = parentElement.element('text');
  const rawText = srcObj.rawText.replace(/ /g, '\u00A0');

  srcObj.paragraphs.map((paragraph: Paragraph) => {
    paragraph.lines.map((line: Line[]) => {
      line.map((linePart: Line) => {
        const element: XMLElementOrXMLNode = svgTextElement
          .element('tspan')
          .raw(rawText.substring(linePart.from, linePart.to));

        applyIfPossible(element, 'x', linePart.x);
        applyIfPossible(element, 'y', linePart.y);
      });
    });
  });

  return svgTextElement;
}
