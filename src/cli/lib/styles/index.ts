import fill from './fill';
import filters from './filters';
import font from './font';
import opacity from './opacity';
import stroke from './stroke';
import textAttributes from './textAttributes';

const parsers: { [parser: string]: Parser } = {
  fill,
  filters,
  font,
  opacity,
  stroke,
  textAttributes,
};

export interface Parser {
  name?: string;
  parse: (...args) => string;
}

export default parsers;
