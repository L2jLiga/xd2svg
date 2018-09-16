/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { RawResource } from './resources';

export interface ManifestFile {
  id: string;
  'uxdesign#hotspotHints': boolean;
  'uxdesign#highResPushed': boolean;
  'uxdesign#fullscreen': boolean;
  'uxdesign#lowResPushed': boolean;
  children: Array<ArtworkRoot | RawResourceRoot>;
  'uxdesign#allowComments': boolean;
  'uxdesign#version': string;
  'uxdesign#userDidSetPrototypeName': boolean;
  'uxdesign#userDidSetSpecName': boolean;
  'uxdesign#id': boolean;
  components: any[];
  name: string;
  type: string;
  'manifest-format-version': number;
  state: string;
}

interface ArtworkRoot {
  name: 'artwork';
  children: any[];
}

interface RawResourceRoot {
  name: 'resources';
  components: RawResource[];
}
