import { convertXd }   from './cli/convert-xd';
import { Options } from './common';

const options: Options = JSON.parse(process.argv.pop());
const inputFile: string = process.argv.pop();

convertXd(inputFile, options)
  .catch(() => process.exit(-1));
