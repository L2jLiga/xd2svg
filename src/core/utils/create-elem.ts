import { XMLNode }                  from 'xmlbuilder';
import { Options }                              from '../../common';
import * as logger                              from '../../utils/logger';
import { createShape, TextConverter }           from '../converters';
import { createStyles }                         from '../create-styles';
import { Artboard, Shape }                      from '../models';
import { ArtboardLike }                         from '../models/artboard';
import { applyIfPossible }                      from './guarded-ops';
import { svgRectToClipPath, SvgRectToClipPath } from './svg-rect-to-clip-path';

export function createElem(collection: ArtboardLike, parent: XMLNode, defs: XMLNode, options: Options = {}): XMLNode {
  collection.children
    .map((svgObject: Artboard): void => {
      let node: XMLNode;

      switch (svgObject.type) {
        case 'shape':
          const shape = svgObject.shape;

          if (shape.type === 'compound' && !options.preferCompoundPath) {
            node = parent.element('g');
            createElem(shape, node, defs, options);

            break;
          }

          node = createShape(shape, parent);
          applyBorderRadius(svgObject, shape, defs);
          break;

        case 'text':
          node = TextConverter.createText(svgObject.text, parent).result;
          break;

        case 'group':
          node = parent.element('g');
          createElem(svgObject.group, node, defs, options);
          break;

        default:
          console.warn(`${logger.bold(logger.red('Create element:'))} unknown type: %j`, svgObject);
          return;
      }

      applyAttributes(node, defs, svgObject);
    });

  return parent;
}

function applyBorderRadius(svgObject: Artboard, shape: Shape, defs: XMLNode) {
  if (shape.type === 'rect' && shape.r) {
    const {width, height, r} = shape;
    const ref = `clip-path-${width}-${height}-${r.join('-')}`;

    createClipPath({width, height, r}, ref, defs);

    svgObject.style = svgObject.style || {};
    svgObject.style.clipPath = {ref};
  }
}

function createClipPath(data: SvgRectToClipPath, id: string, defs: XMLNode) {
  const {width, height, r} = data;
  const maxBR = Math.min(width, height) / 2;

  const clipPath = svgRectToClipPath({
    height,
    r: [
      Math.min(r[0], maxBR),
      Math.min(r[1], maxBR),
      Math.min(r[2], maxBR),
      Math.min(r[3], maxBR),
    ],
    width,
  }, defs);

  clipPath.attribute('id', id);
}

function applyAttributes(node: XMLNode, defs: XMLNode, svgObject: Artboard) {
  applyIfPossible(node, 'id', svgObject.id);
  applyIfPossible(node, 'name', svgObject.name);

  if (svgObject.visible === false) {
    svgObject.style ? svgObject.style.display = 'none' : svgObject.style = {display: 'none'};
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
