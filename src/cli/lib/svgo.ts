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
