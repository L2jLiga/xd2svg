'use strict';

const fs = require('fs');

module.exports = function manifestParser(directory) {
  const json = fs.readFileSync(`${directory.name}/manifest`, 'utf-8');

  const manifest = JSON.parse(json);

  const manifestInfo = {
    id: manifest.id,
    version: manifest['uxdesign#version'],
    artboards: [],
    resources: [],
  };

  manifest.children.forEach((child) => {
    if (child.name === 'artwork') manifestInfo.artboards.push(...child.children);

    if (child.name === 'resources') manifestInfo.resources = parseResources(child.components);
  });

  manifestInfo.artboards = manifestInfo.artboards.filter((artboard) => Boolean(artboard['uxdesign#bounds']));

  return manifestInfo;

  /**
   * Parse resources binary files to blob
   * @param {Array} resources - Array of resources
   * @return {Object} Object representing resources in base64;
   */
  function parseResources(resources) {

    const resourcesObject = {};

    resources.forEach((res) => {
      const resourceSourcePath = directory.name + '/resources/' + res.path;

      const resourceSource = fs.readFileSync(resourceSourcePath);

      const base64 = new Buffer(resourceSource).toString('base64');

      resourcesObject[res.path] = `data:${res.type};base64,${base64}`;
    });

    return resourcesObject;
  }
};

