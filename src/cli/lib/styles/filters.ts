import camelToDash from '../utils/camel-to-dash';
import colorTransformer from '../utils/color-transformer';
import { document } from '../utils/global-namespace';

export function filters(
  src: any,
  parentElement: Element,
  targetElement: Element,
): void {
  const filterList: string[] = [];

  src.forEach((filter) => {
    const filterName = filter.type.includes('#blur') ? 'blur' : camelToDash(filter.type);
    const filterParams = filter.params[filter.type + 's'] || filter.params || {};

    switch (filterName) {
      case 'blur': {
        const filterId: string = `blur-${filterParams.blurAmount}-${filterParams.brightnessAmount}`;

        const svgFilterElement = document.createElementNS('http://www.w3.org/2000/svg', 'filter');

        const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');

        blur.setAttribute('in', 'SourceGraphic');
        blur.setAttribute('stdDeviation', filterParams.blurAmount);

        svgFilterElement.setAttribute('id', filterId);
        svgFilterElement.appendChild(blur);

        parentElement.appendChild(svgFilterElement);

        filterList.push(`url(#${filterId})`);

        break;
      }

      case 'drop-shadow': {
        for (const {dx, dy, r, color} of filterParams) {
          const filterId: string = `drop-shadow-${dx}-${dy}-${r}-${color.mode}`;

          const svgFilterElement = document.createElementNS('http://www.w3.org/2000/svg', 'filter');

          svgFilterElement.setAttribute('id', filterId);

          const dropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
          dropShadow.setAttribute('dx', dx);
          dropShadow.setAttribute('dy', dy);
          dropShadow.setAttribute('stdDeviation', r);
          dropShadow.setAttribute('flood-color', colorTransformer(color));

          svgFilterElement.appendChild(dropShadow);

          parentElement.appendChild(svgFilterElement);

          filterList.push(`url(#${filterId})`);
        }

        break;
      }

      default:
        console.log(`Currently unsupported filter: ${filterName}`);
    }
  });

  targetElement.setAttribute('style', targetElement.getAttribute('style') + `; filter: ${filterList.join(' ')}; `);

}
