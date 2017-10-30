module.exports = function(artboardCollection) {
  'use strict';

  let svgImages = [];

  artboardCollection.children.forEach(convertArtboardToSVG);

  return svgImages;

  function createShape(pathObject) {
    let object = document.createElementNS('http://www.w3.org/2000/svg', pathObject.type);

    if (pathObject.type === 'path') {
      object.setAttribute('d', pathObject.path);
    } else if (pathObject.type === 'rect') {
      object.setAttribute('x', pathObject.x);
      object.setAttribute('y', pathObject.y);
      object.setAttribute('width', pathObject.width);
      object.setAttribute('height', pathObject.height);
    } else if (pathObject.type === 'circle') {
      object.setAttribute('cx', pathObject.cx);
      object.setAttribute('cy', pathObject.cy);
      object.setAttribute('r', pathObject.r);
    }

    return object;
  }

  function createText(textObject) {
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    let rawText = textObject.rawText;

    textObject.paragraphs.forEach(function (paragraph) {
      paragraph.lines.forEach(function (line) {
        line.forEach(function (linePart) {
          let line = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');

          line.innerHTML = rawText.substring(linePart.from, linePart.to);

          line.setAttribute('x', linePart.x);

          line.setAttribute('y', linePart.y);

          text.appendChild(line);
        });
      });
    })

    return text;
  }

  function generateStyles(node, stylesObject) {
    function createColor(fillColor) {
      let color;

      switch (fillColor.mode) {
        case 'RGB':
          if (fillColor.alpha) {
            return 'rgba(' + fillColor.value.r + ',' + fillColor.value.g + ',' + fillColor.value.b + ',' + fillColor.alpha + ')';
          } else {
            return 'rgb(' + fillColor.value.r + ',' + fillColor.value.g + ',' + fillColor.value.b + ')';
          }

          break;
        case 'HSL':
          if (fillColor.alpha) {
            return 'hsla(' + fillColor.value.h + ',' + fillColor.value.s + ',' + fillColor.value.l + ',' + fillColor.alpha + ')';
          } else {
            return 'hsl(' + fillColor.value.h + ',' + fillColor.value.s + ',' + fillColor.value.l + ')';
          }

          break;
      }

      return color;
    }

    if (stylesObject.fill) {
      if (stylesObject.fill.type !== 'none') {
        node.style.fill = createColor(stylesObject.fill.color);
      } else {
        node.style.fill = 'none';
      }
    }

    if (stylesObject.stroke) {
      if (stylesObject.stroke.type !== 'none') {
        node.style.stroke = createColor(stylesObject.stroke.color);

        node.style.strokeWidth = stylesObject.stroke.width;
      } else {
        node.style.stroke = 'none';
      }
    }

    if (stylesObject.font) {
      // TODO: font style oblique/italic/bold/semibold and others....
      node.style.font = '' + (stylesObject.font.size || 16) + 'px ' + stylesObject.font.style;

      node.style.fontFamily = stylesObject.font.family;
      node.style.fontSize = stylesObject.font.size;

      node.style.fontStyle = stylesObject.font.style;
      node.style.fontWeight = stylesObject.font.style;
    }
  }

  function generateTransformations(node, transformationObject) {
    // TODO: write generator for obj
    node.setAttribute('transform', 'translate(' + transformationObject.tx + ' ' + transformationObject.ty + ')');
  }

  function createSvgElem(svgObjCollection, parentNode) {
    svgObjCollection.children.forEach(function (svgObject) {
      let node;

      if (svgObject.type === 'shape') {
        node = createShape(svgObject.shape);
      } else if (svgObject.type === 'text') {
        node = createText(svgObject.text);
      } else if (svgObject.type === 'group') {
        node = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        createSvgElem(svgObject.group, node);
      }

      if (svgObject.style) {
        generateStyles(node, svgObject.style);
      }

      if (svgObject.transform) {
        generateTransformations(node, svgObject.transform);
      }

      parentNode.appendChild(node);
    });

    return parentNode;
  }

  function convertArtboardToSVG(imageRootObject) {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    // TODO: Read from manifest
    let backGround = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    svg.setAttribute('viewBox', '0 0 375 667');
    backGround.setAttribute('width', 375);
    backGround.setAttribute('height', 667);
    generateStyles(backGround, imageRootObject.style);
    svg.appendChild(backGround);

    svgImages.push(createSvgElem(imageRootObject.artboard, svg));
  }
}