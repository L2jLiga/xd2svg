/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { readFileSync } from 'fs';
import { Directory } from './models';

interface ManifestFile {
  id: string;
  'uxdesign#hotspotHints': boolean;
  'uxdesign#highResPushed': boolean;
  'uxdesign#fullscreen': boolean;
  'uxdesign#lowResPushed': boolean;
  children: Array<Artwork | Resource>;
  'uxdesign#allowComments': boolean;
  'uxdesign#version': boolean;
  'uxdesign#userDidSetPrototypeName': boolean;
  'uxdesign#userDidSetSpecName': boolean;
  'uxdesign#id': boolean;
  components: any[];
  name: string;
  type: string;
  'manifest-format-version': number;
  state: string;
}

interface Artwork {
  name: 'artwork';
  children: any[];
}

interface Resource {
  name: 'resources';
  components: RawResource[];
}

export function manifestParser(directory: Directory) {
  const json: string = readFileSync(`${directory.name}/manifest`, 'utf-8');

  const manifest: ManifestFile = JSON.parse(json);

  const manifestInfo = {
    artboards: [],
    id: manifest.id,
    name: manifest.name,
    resources: null as ResourcesMap,
    version: manifest['uxdesign#version'],
  };

  manifest.children.forEach((child) => {
    if (child.name === 'artwork') manifestInfo.artboards.push(...child.children);

    if (child.name === 'resources') manifestInfo.resources = parseResources(directory.name, child.components);
  });

  manifestInfo.artboards = manifestInfo.artboards.filter((artboard) => Boolean(artboard['uxdesign#bounds']));

  return manifestInfo;
}

interface RawResource {
  path: string;
  type: string;
}

interface ResourcesMap {
  [path: string]: string;
}

function parseResources(dirName: string, resources: RawResource[] = []): ResourcesMap {
  const resourcesObject = {};

  resources.forEach((res) => {
    const resourceSourcePath = dirName + '/resources/' + res.path;

    const resourceSource: Buffer = readFileSync(resourceSourcePath);

    const base64 = resourceSource.toString('base64');

    resourcesObject[res.path] = `data:${res.type};base64,${base64}`;
  });

  return resourcesObject;
}
