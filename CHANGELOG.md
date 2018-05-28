# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/L2jLiga/xd2svg/compare/v0.3.1...HEAD
[0.3.1]: https://github.com/L2jLiga/xd2svg/compare/v0.3.1...v0.3.0
[0.3.0]: https://github.com/L2jLiga/xd2svg/compare/v0.3.0...v0.2.1
[0.2.1]: https://github.com/L2jLiga/xd2svg/compare/v0.2.1...v0.2.0
[0.2.0]: https://github.com/L2jLiga/xd2svg/compare/v0.2.0...v0.1.8
[0.1.8]: https://github.com/L2jLiga/xd2svg/compare/v0.1.8...v0.1.7
[0.1.7]: https://github.com/L2jLiga/xd2svg/compare/v0.1.7...v0.1.6
[0.1.6]: https://github.com/L2jLiga/xd2svg/compare/v0.1.6...v0.1.5
[0.1.5]: https://github.com/L2jLiga/xd2svg/compare/v0.1.5...v0.1.4
[0.1.4]: https://github.com/L2jLiga/xd2svg/compare/v0.1.4...v0.1.3
[0.1.3]: https://github.com/L2jLiga/xd2svg/compare/v0.1.3...v0.1.2
[0.1.2]: https://github.com/L2jLiga/xd2svg/compare/v0.1.2...v0.1.1
[0.1.1]: https://github.com/L2jLiga/xd2svg/compare/v0.1.1...v0.1.0
[0.1.0]: https://github.com/L2jLiga/xd2svg/compare/v0.1.0...v0.0.1
