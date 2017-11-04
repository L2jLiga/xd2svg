# xd2svg
Utility for converting Adobe eXperience Design files into SVG

## Installation

1. via npm

   ```npm
    npm install xd2svg -g
   ```

2. via yarn

   ```npm
    yarn global add xd2svg
   ```

## Usage

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
