import {ArtboardInfo} from "./artboard-info";

export interface Resource {
  artboards: {[name: string]: ArtboardInfo};
  gradients: string;
}
