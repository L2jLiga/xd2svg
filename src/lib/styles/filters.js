'use strict';

const createColor = require('./colorTransformer');
const camelToDash = require('../camelToDash');

module.exports = function filters(filters) {
  let filtersStyle = '';

  filters.forEach((filter) => {
    const filterName = camelToDash(filter.type);
    const filterParams = filter.params[filter.type + 's'];

    filterParams.forEach((filterParam) => {
      filtersStyle += ` ${filterName}( `;
      Object.keys(filterParam).forEach((key) => {
        const filterValue = filterParam[key];

        filtersStyle += ' ' + ((filterValue.mode) ? createColor(filterValue) : filterValue) + ' ';
      });
      filtersStyle += ` ) `;
    });
  });

  return filtersStyle;
};
