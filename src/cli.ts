import xd2svg from './cli/xd2svg';

const inputFileName = process.argv[2];
let outputFileName = process.argv[3];

if (inputFileName) {
  if (!outputFileName) {
    const inputName = inputFileName.split('.');

    if (inputName.length > 1) {
      inputName.pop();
    }

    inputName.push('html');

    outputFileName = inputName.join('.');
  }

  xd2svg(inputFileName, outputFileName);

  console.log(inputFileName, outputFileName);
  
} else {
	console.log('Usage: xd2svg-cli InputFile.xd [OutputFile.html]')
}
