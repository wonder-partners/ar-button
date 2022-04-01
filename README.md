# AR Button
A web-component to display a 3D model in augmented reality using the native [Quick Look](https://developer.apple.com/documentation/arkit/previewing_a_model_with_ar_quick_look) on iOS and [Scene Viewer](https://developers.google.com/ar/develop/java/scene-viewer) on Android. Heavily inspired by [model-viewer](https://modelviewer.dev/) and [@leoncvlt/ar-button](https://leoncvlt.github.io/ar-button/).

## Installation / Usage

Install the npm package:

And import the library and the default stylesheet (optional) in your file:

Or import from a CDN:

Then use it like any html component:

```html
<ar-button
    src="https://your.model.glb"
    ios-src="https://your.model.usdz">
 	View in your space
</ar-button>
```

## Attributes

| Attribute name | Platform  | Description                                                  |
| -------------- | --------- | ------------------------------------------------------------ |
| `src`          | `android` | The URL to the 3D model for Android platform. Only glTF/GLB models are supported. |
| `ios-src`      | `ios`     | The URL to the 3D model for iOS platform. Only USDZ models are supported. |

