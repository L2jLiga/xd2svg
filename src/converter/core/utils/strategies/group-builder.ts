/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as xmlbuilder from 'xmlbuilder';
import { Options } from '../../../../common';
import { Artboard, GroupArtboard } from '../../models/artboard';
import { createElem } from '../create-elem';
import { ElementBuilder } from './element-builder';

export class GroupBuilder implements ElementBuilder<GroupArtboard> {
  public supports(svgObject: Artboard): svgObject is GroupArtboard {
    return svgObject.type === 'group';
  }

  public convert(svgObject: GroupArtboard, parent: xmlbuilder.XMLNode, defs: xmlbuilder.XMLNode, options: Options) {
    const node = parent.element('g');
    createElem(svgObject.group, node, defs, options);

    return node;
  }
}
