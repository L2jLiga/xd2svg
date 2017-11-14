const fs = require('fs');

module.exports = function (directory) {
  'use strict';

  let json = fs.readFileSync(`${directory.name}/manifest`, 'utf-8');

  let manifest = JSON.parse(json);

  let manifestInfo = {};

  manifestInfo.id = manifest.id;
  manifestInfo.version = manifest['uxdesign#version'];
  manifestInfo.artboards = [];

  manifest.children.forEach(child => child.path === 'artwork' ? manifestInfo.artboards.push(...child.children) : void 0);

  manifestInfo.artboards = manifestInfo.artboards.filter(artboard => Boolean(artboard['uxdesign#bounds']));

  return manifestInfo;
};