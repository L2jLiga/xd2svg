'use strict';

const fs = require('fs');

module.exports = function manifestParser(directory) {
  const json = fs.readFileSync(`${directory.name}/manifest`, 'utf-8');

  const manifest = JSON.parse(json);

  const manifestInfo = {};

  manifestInfo.id = manifest.id;
  manifestInfo.version = manifest['uxdesign#version'];
  manifestInfo.artboards = [];

  manifest.children.forEach((child) => {
    if (child.path === 'artwork') manifestInfo.artboards.push(...child.children);
  });

  manifestInfo.artboards = manifestInfo.artboards.filter((artboard) => Boolean(artboard['uxdesign#bounds']));

  return manifestInfo;
};
