# xd2svg
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/xd2svg.svg)](https://badge.fury.io/js/xd2svg)

Utility for converting Adobe eXperience Design files into SVG.

## Table of content
   * [xd2svg](#xd2svg)
      * [Table of content](#table-of-content)
      * [Getting started](#getting-started)
         * [Prerequisites](#prerequisites)
         * [Installation](#installation)
         * [Using](#using)
      * [Contributing](#contributing)
      * [Versioning](#versioning)
      * [Authors](#authors)
      * [License](#license)
      * [Defenition list](#defenition-list)
      * [Structure of XD files](#structure-of-xd-files)

## Getting started

### Prerequisites
1. Node.js latest (Node.js >= 6.0 in plans)
2. Package manager (**yarn** or **npm**)

### Installation

Two ways to install utility:
1. via npm

   ```npm
    npm install xd2svg -g
   ```

2. via yarn

   ```npm
    yarn global add xd2svg
   ```

### Using

You can use utility from CLI

   ```npm
    xd2svg-cli input.xd [output.svg]
   ```

or require it directly in your scripts

   ```js
    const xd2svg = require('xd2svg');

    let inputFileName = 'someFile.xd';
    let outputFileName = 'someFile.svg';

    xd2svg(inputFileName, outputFileName);
   ```
## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Andrey Chalkin** - *Initial work* - [PurpleBooth](https://github.com/L2jLiga)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Defenition list

<dl>
  <dt>What is Adobe XD?</dt>
  <dd>It's software from Adobe Creative Cloud which used by designers for creating prototypes.</dd>

  <dt>Can I know more about Adobe XD?</dt>
  <dd>Yes, see this <a href="http://www.adobe.com/ru/products/xd.html">link</a></dd>
  
  <dt>What's present *.xd files?</dt>
  <dd>It's simple archives with meta-data and JSON</dd>
</dl>

## Structure of XD files

Zip data (MIME type "application/vnd.adobe.sparkler.project+dcxucf")

- [__DIR__] artwork
  - [__DIR__] artboard-{uuid}
    - [__DIR__] graphics
      - [__JSON__] graphicsContent.ags
  - [__DIR__] pasteboard
    - [__DIR__] graphics
      - [__JSON__] graphicsContent.ags
- [__DIR__] interactions
  - [__JSON__] interactions.json
- [__DIR__] META-INF
  - [__XML__] metadata.xml
- [__DIR__] resources
    - [__DIR__] graphics
      - [__JSON__] graphicsContent.ags
- [__JSON__] manifest
- [__TEXT__] mimetype
- [__IMAGE__] preview.png
- [__IMAGE__] thumbnail.png
