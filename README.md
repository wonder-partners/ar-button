# AR Button
A web-component to display a 3D model in augmented reality using the native [Quick Look](https://developer.apple.com/documentation/arkit/previewing_a_model_with_ar_quick_look) on iOS and [Scene Viewer](https://developers.google.com/ar/develop/java/scene-viewer) on Android. Heavily inspired by [model-viewer](https://modelviewer.dev/) and [@leoncvlt/ar-button](https://leoncvlt.github.io/ar-button/).

## Quick Start

```html
<!-- Import the component -->
<script type="module" src="https://unpkg.com/@wonder-partners/ar-button"></script>

<!-- Default stylesheet (optional) -->
<link rel="stylesheet" href="https://unpkg.com/@wonder-partners/ar-button/styles.css">

<!-- Use it like any other HTML element -->
<ar-button
    src="https://your.model.glb"
    ios-src="https://your.model.usdz">
 	View in your space
</ar-button>
```

## Attributes

`src` → *uri* (Android)

The URL to the 3D model for Android platform. Only glTF/GLB models are supported.

`title` → *string* (Android)

A name for the model. If present, it will be displayed in the UI. The name will be truncated with ellipses after 60 characters.    

`fallback-url` → *uri* (Android)

When the [Google app](https://play.google.com/store/apps/details?id=com.google.android.googlequicksearchbox) is not present on the device, this is the URL that the browser navigates to.

`link` → *uri* (Android, iOS)

A URL for an external webpage. If present, a button will be surfaced in the UI that intents to this URL when clicked.

`ios-src` → *uri* (iOS)

The URL to the 3D model for iOS platform. Only USDZ models are supported.

`checkout-title` → *string* (iOS)

A name for the model. If present, it will be displayed in the UI. Only works if supplied alongside `checkout-subtitle`, `price`, and `call-to-action`.

`checkout-subtitle` → *string* (iOS)

If present, it will be displayed in the UI. Only works if supplied alongside `checkout-subtitle`, `price`, and `call-to-action`.  

`price` → *string* (iOS)

If present, it will be displayed in the UI. Only works if supplied alongside `checkout-subtitle`, `price`, and `call-to-action`. AR Quick Look displays the subtitle and price separated by a comma below the title. Price should include the currency symbol.

`call-to-action` → *string* (iOS)

If present, display this text as a button the quick look default UI. Only works when supplied alongside `checkout-title`, `checkout-subtitle` and `price`. You should also supply an url to `link` (see above).
