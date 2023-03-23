# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] 2023-03-23

### Fixed

- `allows-content-scaling` attribute on iOS unexpected behavior.

## [1.0.2] 2023-03-20

### Fixed

- iOS on Chrome browser compatibility issue. See readme for more information.

## [1.0.1] 2023-02-07

### Fixed

- Backward compatibility with old versions

## [1.0.0] 2023-01-26

### Added

- Public API to defer an `ar-button` initialization.
- Minimized `main.js`.

## [0.5.2] 2022-10-03

- Revert Fix user agent issues on iPad as it broke iOS.

## [0.5.1] 2022-10-03

- Fix user agent issues on iPad.

## [0.5.0] 2022-08-08

### Added

- `allows-content-scaling` attribute for iOS. If set to 0, disables the pinch scaling feature. If omitted, default is 1 (pinch scaling feature enabled).

## [0.4.0] 2022-08-05

### Added

- `occlusion` attribute for android. If omitted, disables object blending mode.

## [0.3.1] 2022-07-13

### Fixed

- Misspell on `canonicalWepPageURL` attribute.

## [0.3.0] 2022-07-11

### Added

- `id` attribute set to `ar-anchor` when creating the anchor.
- `canonicalWepPageURL` attribute for iOS.

## [0.1.0] 2022-00-00

### Added

- `<ar-button>` component.
