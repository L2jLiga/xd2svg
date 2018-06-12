import camelToDash from '../utils/camelToDash';
import createColor from '../utils/colorTransformer';
import { Parser } from './index';

const filterParser: Parser = {
  name: 'filter',
  parse: filters,
};

function filters(src: any): string {
  let filtersStyle = '';

  src.forEach((filter) => {
    const filterName = filter.type.includes('#blur') ? 'blur' : camelToDash(filter.type);
    const filterParams = filter.params[filter.type + 's'] || filter.params || {};

    try {
      filterParams.forEach((filterParam) => {
        filtersStyle += ` ${filterName}( `;
        Object.keys(filterParam).forEach((key) => {
          const filterValue = filterParam[key];

          filtersStyle += ' ' + ((filterValue.mode) ? createColor(filterValue) : filterValue) + ' ';
        });
        filtersStyle += ` ) `;
      });
    } catch (error) {
      console.log(`Unsupported filter: ${filterName}`);
    }
  });

  return filtersStyle;
}

export default filterParser;
