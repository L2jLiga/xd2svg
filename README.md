# xd2svg
[![npm version](https://badge.fury.io/js/xd2svg.svg?colorB=brightgreen)](https://www.npmjs.com/package/xd2svg)
[![npm](https://img.shields.io/npm/dm/xd2svg.svg?colorB=brightgreen)](https://www.npmjs.com/package/xd2svg)
[![node](https://img.shields.io/node/v/xd2svg.svg?colorB=brightgreen)](https://www.npmjs.com/package/xd2svg)
[![Dependency Status](https://img.shields.io/david/L2jLiga/xd2svg.svg)](https://david-dm.org/L2jLiga/xd2svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/L2jLiga/xd2svg.svg?branch=master)](https://travis-ci.org/L2jLiga/xd2svg)
[![codecov](https://codecov.io/gh/L2jLiga/xd2svg/branch/master/graph/badge.svg)](https://codecov.io/gh/L2jLiga/xd2svg)

Utility for converting Adobe eXperience Design files into SVG.

## Table of Contents

   * [xd2svg](#xd2svg)
      * [Table of Contents](#table-of-contents)
      * [Getting started](#getting-started)
         * [Prerequisites](#prerequisites)
         * [Installation](#installation)
         * [Using](#using)
      * [Contributing](#contributing)
      * [Versioning](#versioning)
      * [Changelog](#changelog)
      * [Authors](#authors)
      * [License](#license)
      * [Defenition list](#defenition-list)
      * [Structure of XD files](#structure-of-xd-files)


## Getting started

### Prerequisites
1. Node.js 8.6.0 or higher
1. Package manager: npm, yarn or what you prefer

### Installation
Two ways to install utility:
1. via npm

   ```
    npm install xd2svg -g
   ```

1. via yarn

   ```
    yarn global add xd2svg
   ```

### Using
You can use utility from CLI

   ```
   xd2svg-cli InputFile.xd [options]
   
     options:
       -o, --output - specify output path (default FileName directory or FileName.svg)
       -s, --single - specify does output should be single file with all artboards or directory with separated each other (default: true)
   ```

Or [import package into your project](example)

## Contributing
Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

*TL;DR*

- Don't duplicate issues
- PR's are welcome!

## Versioning
We use [SemVer](https://semver.org/spec/v2.0.0.html) for versioning.
For the versions available, see the [releases](https://github.com/L2jLiga/xd2svg/releases) and [tags](https://github.com/L2jLiga/xd2svg/tags) on this repository. 

## Changelog
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
For the versions changelog, see the [CHANGELOG.md](CHANGELOG.md)

## Known issues
Blur filters work incorrectly for some cases

## Authors
* **Andrey Chalkin** - *Initial work* - [L2jLiga](https://github.com/L2jLiga)

* **Yang Sibai** - *Testing* - [yangsibai](https://github.com/yangsibai)

See also the list of [contributors](https://github.com/L2jLiga/xd2svg/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Defenition list
* **What is Adobe XD?**

   It's software from Adobe Creative Cloud which used by designers for creating prototypes.

* **Can I know more about Adobe XD?**

   Yes, you can know more on [official website](https://www.adobe.com/ru/products/xd.html).

* **What is present \*.xd files?**

   It's simple archives with meta-data and JSON.

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
