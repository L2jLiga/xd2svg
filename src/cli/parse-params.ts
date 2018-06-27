import { CliOptions } from './models';

export function parseParams(): CliOptions {
  const inputFileName: string = process.argv[2];
  let customOutput: boolean = false;

  const inputName: string[] = inputFileName.split('.');

  if (inputName.length > 1) {
    inputName.pop();
  }

  const options: CliOptions = {
    format: 'svg',
    output: inputName.join('.'),
    single: true,
  };

  for (let argIdx = 2; argIdx++; argIdx < process.argv.length) {
    if (process.argv[argIdx] === undefined) break;

    const arg = process.argv[argIdx].split('=');
    switch (arg[0]) {
      case '-f':
      case '--format':
        options.format = /^html$/i.test(arg[1]) ? 'html' : 'svg';
        break;

      case '-o':
      case '--output':
        options.output = arg[1];
        customOutput = true;
        break;

      case '-s':
      case '--single':
        options.single = /^true$/i.test(arg[1]);
    }
  }

  if (!customOutput && options.single) {
    options.output += `.${options.format}`;
  }

  return options;
}
