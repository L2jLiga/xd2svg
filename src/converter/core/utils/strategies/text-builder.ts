/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLNode }                from 'xmlbuilder';
import { TextConverter }          from '../../converters';
import { Artboard, TextArtboard } from '../../models/artboard';
import { ElementBuilder }         from './element-builder';

export class TextBuilder implements ElementBuilder<TextArtboard> {
  public supports(svgObject: Artboard): svgObject is TextArtboard {
    return svgObject.type === 'text';
  }

  public convert(svgObject: TextArtboard, parent: XMLNode): XMLNode {
    return TextConverter.createText(svgObject.text, parent).result;
  }
}
