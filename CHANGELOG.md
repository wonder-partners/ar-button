# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
