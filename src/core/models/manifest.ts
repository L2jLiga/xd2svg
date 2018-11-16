import { ResourcesMap } from './resources';

export interface ArtboardDefinition {
  name: string;
  path: string;
}

export interface Manifest {
  artboards: ArtboardDefinition[];
  id: string;
  name: string;
  resources: ResourcesMap;
  version: string;
}
