/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLNode }         from 'xmlbuilder';
import { Options }         from '../../../common';
import * as logger         from '../../../common/utils/logger';
import { createStyles }    from '../create-styles';
import { Artboard }        from '../models';
import { ArtboardLike }    from '../models/artboard';
import { applyIfPossible } from './guarded-ops';
import { elementBuilders } from './strategies';

export function createElem(collection: ArtboardLike, parent: XMLNode, defs: XMLNode, options: Options = {}): XMLNode {
  collection.children
    .forEach((svgObject: Artboard) => {
      const builder = elementBuilders.find((it) => it.supports(svgObject));

      if (!builder) {
        console.warn(`${logger.bold(logger.red('Create element:'))} unknown type: %j`, svgObject);

        return;
      }

      const node = builder.convert(svgObject, parent, defs, options);

      applyAttributes(node, defs, svgObject);
    });

  return parent;
}

function applyAttributes(node: XMLNode, defs: XMLNode, svgObject: Artboard): void {
  applyIfPossible(node, 'id', svgObject.id);
  applyIfPossible(node, 'name', svgObject.name);

  if (svgObject.visible === false) {
    svgObject.style = { ...svgObject.style, display: 'none' };
  }

  if (svgObject.style) {
    node.attribute('style', createStyles(svgObject.style, defs));
  }

  if (svgObject.transform) {
    node.attribute('transform', createTransforms(svgObject.transform));
  }
}

function createTransforms(src): string {
  return `matrix(${src.a}, ${src.b}, ${src.c}, ${src.d}, ${src.tx}, ${src.ty})`;
}
