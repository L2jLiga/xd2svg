/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { readFileSync }                                      from 'fs';
import { Dictionary, Directory }                             from '../common';
import { Manifest, ManifestFile, RawResource, ResourcesMap } from './models';

export const manifestInfo: Manifest = {
  artboards: [],
  id: '',
  name: '',
  resources: {} as ResourcesMap,
  version: '',
};

export function manifestParser(directory: Directory) {
  const json: string = readFileSync(`${directory.name}/manifest`, 'utf-8');

  const manifest: ManifestFile = JSON.parse(json);

  manifestInfo.id = manifest.id;
  manifestInfo.name = manifest.name;
  manifestInfo.version = manifest['uxdesign#version'];

  manifest.children.forEach((child) => {
    if (child.name === 'artwork') manifestInfo.artboards.push(...child.children);

    if (child.name === 'resources') manifestInfo.resources = parseResources(directory.name, child.components);
  });

  manifestInfo.artboards = manifestInfo.artboards.filter((artboard) => Boolean(artboard['uxdesign#bounds']));

  return manifestInfo;
}

function parseResources(dirName: string, resources: RawResource[] = []): ResourcesMap {
  const resourcesObject: Dictionary<string> = {};

  resources.forEach((res) => {
    const resourceSourcePath = dirName + '/resources/' + res.path;

    const resourceSource: Buffer = readFileSync(resourceSourcePath);

    const base64 = resourceSource.toString('base64');

    resourcesObject[res.path] = `data:${res.type};base64,${base64}`;
  });

  return resourcesObject;
}
