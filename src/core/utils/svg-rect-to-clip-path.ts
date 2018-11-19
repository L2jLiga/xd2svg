import { XMLElementOrXMLNode } from 'xmlbuilder';

export interface SvgRectToClipPath {
  width: number;
  height: number;
  r: number[];
}

export function svgRectToClipPath(attributes: SvgRectToClipPath, defs: XMLElementOrXMLNode) {
  const clipPath = defs.element('clipPath');

  clipPath.element('path', {
    d: svgRectToPath(attributes),
  });

  return clipPath;
}

export function svgRectToPath(attributes: SvgRectToClipPath) {
  const x = 0;
  const y = 0;
  const width = attributes.width;
  const height = attributes.height;

  const leftTopCorner = attributes.r[0];
  const rightTopCorner = attributes.r[1];
  const rightBottomCorner = attributes.r[2];
  const leftBottomCorner = attributes.r[3];

  return (
    '' +
    // start at the left corner
    'M' +
    (x + leftTopCorner) +
    ' ' +
    y +
    // top line
    'h' +
    (width - leftTopCorner - rightTopCorner) +
    // upper right corner
    (rightTopCorner || rightBottomCorner ? 'a ' + rightTopCorner + ' ' + rightBottomCorner + ' 0 0 1 ' + rightTopCorner + ' ' + rightBottomCorner : '') +
    // Draw right side
    'v' +
    (height - rightTopCorner - rightBottomCorner) +
    // Draw bottom right corner
    (rightBottomCorner ? 'a ' + rightTopCorner + ' ' + rightBottomCorner + ' 0 0 1 ' + rightTopCorner * -1 + ' ' + rightBottomCorner : '') +
    // Down the down side
    'h' +
    (width - rightBottomCorner - leftBottomCorner) * -1 +
    // Draw bottom left corner
    (leftBottomCorner
      ? 'a ' + rightBottomCorner + ' ' + leftBottomCorner + ' 0 0 1 ' + rightBottomCorner * -1 + ' ' + leftBottomCorner * -1
      : '') +
    // Down the left side
    'v' +
    (height - leftBottomCorner - leftTopCorner) * -1 +
    // Draw top left corner
    (leftTopCorner ? 'a ' + leftBottomCorner + ' ' + leftTopCorner + ' 0 0 1 ' + leftBottomCorner + ' ' + leftTopCorner * -1 : '') +
    // Close path
    'z'
  );
}
