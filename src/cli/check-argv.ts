import { existsSync } from 'fs';

export function checkArgv(): void {
  if (!process.argv[2]) {
    console.log(`Usage: xd2svg-cli InputFile.xd [options]
  options:
  -o, --output - specify output path (default FileName directory or FileName.svg)
  -f, --format - specify output format: svg, html (default: svg)
  -s, --single - specify does output should be single file with all artboards or directory with separated each other (default: true)

  For additional information: man xd2svg-cli`);

    process.exit(0);
  } else if (!existsSync(process.argv[2])) {
    console.log(`Couldn't find ${process.argv[2]}, are you sure that you write filename right?`);
    process.exit(-1);
  }
}
