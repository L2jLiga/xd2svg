# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Improved pattern support

### Fixed
- Invalid default color
- Invisible elements was visible

## [0.7.1]
### Added
- Man file

### Changed
- Updated deps
- Improved typing (usefull if you use package in your project)
- Improved performance

## [0.7.0]
### Added
- HEX color support
- Line shape support
- Matrix transform support
- Information about name and id of each element in generated SVG
- Compound paths support
- Border radius support for rectangles
- Letter spacing support

### Fixed
- Specific SVGs had incorrect size
- First gradient in resources did not proceed correctly
- Opacity filter did not applied
- Invisible filters were visible

### Removed
- Obsolete code

## [0.6.3]
### Removed
- Useless and anoying logs

## [0.6.2]
### Changed
- Node.js API's

### Fixed
- Error when try to set output with subfolders
- Incorrect filenames when `single=false`

## [0.6.1]
### Fixed
- SVG generates incorrectly

## [0.6.0]
### Added
- Ability to import package
- Type definitions for package

### Changed
- Error messages more usefull
- Docs updated
- Target to es2017 (reduce polyfills count and improve performance)

## [0.5.0]
### Added
- support for ellipse shape

### Changed
- Improve font styles parser

### Fixed
- `clip-path` property doesn't applied
- Pattern applied incorrect when `scaleBehavior` is `cover`

### Breaking changes
- CLI was updated
   ```
   xd2svg-cli InputFile.xd [options]
   
     options:
       --output - specify output path (default FileName directory or FileName.svg)
       --format - specify output format: svg, html (default: svg)
       --single - specify does output should be single file with all artboards or directory with separated each other (default: true)
   ```

## [0.4.2]
### Added
- License information

### Fixed
- Pattern doesn't work

## [0.4.1]
### Added
- `.editorconfig`
- Message when unsupported style
- Message when unsupported shape
- Clip-path support

### Changed
- Renamed all files to dash case
- Updated devDependencies
- Minimal Node.js version 8.6.0 (was 8.9.4)
- tsconfig target now `es2016` (was `es2015`)
- Cleanup dist before publish

### Removed
- Dead code

## [0.4.0] - 2018-06-13
### Added
- Blur filter support

### Changed
- Code cleanup
- Configured tslint
- Updated devDependencies
- Improved performance

### Fixed
- Fixed document is not defined error
- Drop shadow filter doesn't work
- SVGO doesn't work

## [0.3.1] - 2018-05-27
### Fixed
- Fix for running CLI

## [0.3.0] - 2018-05-27
### Changed
- Fix message about calling async function w/o callback
- Fix FC when unknown filter
- Moved to TypeScript
- Moved to Webpack
- Generate HTML instead of SVG
- Update dependencies

### Removed
- Remove `lint` task
- Support for node.js < 8.9.4

## [0.2.1] - 2017-11-20
### Fixed
- Fixed unexpected behaviour when trying to run utility

## [0.2.0] - 2017-11-20
### Added
- Add support for filters
- Add build task

### Removed
- Support for node.js < 6.10

## [0.1.8] - 2017-11-20
### Added
- Add SVGO
- Add support for text attributes `text-align` and `line-height`
- Add support for element opacity

### Changed
- Improve font styles support
- Fix positioning of text elements

## [0.1.7] - 2017-11-19
### Added
- Add `lint` task
- Add raster graphics support

### Changed
- Improve font style support

## [0.1.6] - 2017-11-18
### Added
- Add support for import utility as library
- Add support for linearGradients

### Changed
- Get information about artboards from resources directory
- Separate functionality from CLI

## [0.1.5] - 2017-11-04
### Changed
- Add title for each svg image
- Default fill color set to `white`
- Fix invalid x coordinate when it doesn't present
- Fix invalid viewBox generation
- Fix invalid viewport generation

## [0.1.4] - 2017-11-03
### Added
- Add JSDoc to artboardConverter

### Changed
- Fix issue with crash when `fill` or `stroke` don't contain color

## [0.1.3] - 2017-11-02
### Changed
- Use temporary directories for passing files

## [0.1.2] - 2017-11-02
### Added
- Add extra information into package.json

### Changed
- Change temporary directory for extracted data

## [0.1.1] - 2017-11-01
### Changed
- Fix description of package (README.md)

## [0.1.0] - 2017-11-01
### Added
- Add manifest parser
- Add XD extract
- Add SVG generator

## 0.0.1 - 2017-10-20
### Added
- Add Artboard parser

[Unreleased]: https://github.com/L2jLiga/xd2svg/compare/v0.7.1...HEAD
[0.7.1]: https://github.com/L2jLiga/xd2svg/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/L2jLiga/xd2svg/compare/v0.6.3...v0.7.0
[0.6.3]: https://github.com/L2jLiga/xd2svg/compare/v0.6.2...v0.6.3
[0.6.2]: https://github.com/L2jLiga/xd2svg/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/L2jLiga/xd2svg/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/L2jLiga/xd2svg/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/L2jLiga/xd2svg/compare/v0.4.2...v0.5.0
[0.4.2]: https://github.com/L2jLiga/xd2svg/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/L2jLiga/xd2svg/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/L2jLiga/xd2svg/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/L2jLiga/xd2svg/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/L2jLiga/xd2svg/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/L2jLiga/xd2svg/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/L2jLiga/xd2svg/compare/v0.1.8...v0.2.0
[0.1.8]: https://github.com/L2jLiga/xd2svg/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/L2jLiga/xd2svg/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/L2jLiga/xd2svg/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/L2jLiga/xd2svg/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/L2jLiga/xd2svg/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/L2jLiga/xd2svg/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/L2jLiga/xd2svg/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/L2jLiga/xd2svg/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/L2jLiga/xd2svg/compare/v0.0.1...v0.1.0
