'use strict';

const fill = require('./fill');

module.exports = function stroke(stroke, parentElement, uuid, resources) {
  return fill(stroke, parentElement, uuid, resources) + `;stroke-width:${stroke.width}px`;
};
