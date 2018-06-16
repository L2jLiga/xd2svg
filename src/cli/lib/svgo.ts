/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

const SVGO = require('svgo');

const svgoPlugins = [
    {
      cleanupAttrs: true,
    },
    {
      cleanupEnableBackground: true,
    },
    {
      cleanupIDs: false,
    },
    {
      cleanupListOfValues: true,
    },
    {
      cleanupNumericValues: true,
    },
    {
      collapseGroups: false,
    },
    {
      convertColors: true,
    },
    {
      convertShapeToPath: false,
    },
    {
      convertStyleToAttrs: false,
    },
    {
      convertTransform: true,
    },
    {
      mergePaths: false,
    },
    {
      moveElemsAttrsToGroup: true,
    },
    {
      moveGroupAttrsToElems: true,
    },
    {
      removeComments: true,
    },
    {
      removeDesc: false,
    },
    {
      removeDimensions: false,
    },
    {
      removeDoctype: true,
    },
    {
      removeEditorsNSData: true,
    },
    {
      removeEmptyAttrs: true,
    },
    {
      removeEmptyContainers: true,
    },
    {
      removeEmptyText: true,
    },
    {
      removeHiddenElems: false,
    },
    {
      removeMetadata: false,
    },
    {
      removeNonInheritableGroupAttrs: true,
    },
    {
      removeRasterImages: false,
    },
    {
      removeTitle: false,
    },
    {
      removeUnknownsAndDefaults: false,
    },
    {
      removeUnusedNS: true,
    },
    {
      removeUselessDefs: true,
    },
    {
      removeUselessStrokeAndFill: true,
    },
    {
      removeViewBox: true,
    },
    {
      removeXMLNS: false,
    },
    {
      removeXMLProcInst: false,
    },
    {
      sortAttrs: true,
    },
  ]
;

export const svgo = new SVGO({plugins: svgoPlugins});
