# AR Button

A web-component to display a 3D model in augmented reality using the native [Quick Look](https://developer.apple.com/documentation/arkit/previewing_a_model_with_ar_quick_look) on iOS and [Scene Viewer](https://developers.google.com/ar/develop/java/scene-viewer) on Android. Heavily inspired by [model-viewer](https://modelviewer.dev/) and [@leoncvlt/ar-button](https://leoncvlt.github.io/ar-button/).

## Quick Start

```html
<!-- Import the component -->
<script src="https://unpkg.com/@wonder-partners/ar-button@1.0.0/main.min.js" type="module"></script>

<!-- Default stylesheet (optional) -->
<link rel="stylesheet" href="https://unpkg.com/@wonder-partners/ar-button@1.0.0/styles.css" />

<!-- Use it like any other HTML element -->
<ar-button src="https://your.model.glb" ios-src="https://your.model.usdz">
  View in your space
</ar-button>
```

## Attributes

### Android

#### `src`

The URL to the 3D model for Android platform. Only glTF/GLB models are supported.

#### `title`

A name for the model. If present, it will be displayed in the UI. The name will be truncated with ellipses after 60 characters.

#### `fallback-url`

When the [Google app](https://play.google.com/store/apps/details?id=com.google.android.googlequicksearchbox) is not present on the device, or the device is not compatible with AR Core this is the URL that the browser will navigate to.

#### `occlusion`

If present, turns object blending feature on. If omitted, set object blending feature to off.

#### `link`

A URL for an external webpage. If present, a button will be surfaced in the UI that intents to this URL when clicked.

### iOS

#### `ios-src`

The URL to the 3D model for iOS platform. Only USDZ models are supported.

#### `checkout-title`

A name for the model. If present, it will be displayed in the UI. Only works if supplied alongside _checkout-subtitle_, _price_, and _call-to-action_ attributes.

#### `checkout-subtitle`

If present, it will be displayed in the UI. Only works if supplied alongside _checkout-subtitle_, _price_, and _call-to-action_.

#### `price`

If present, it will be displayed in the UI. Only works if supplied alongside _checkout-subtitle_, _price_, and _call-to-action_. AR Quick Look displays the subtitle and price separated by a comma below the title. Price should include the currency symbol.

#### `call-to-action`

If present, display this text as a button the quick look default UI. Only works when supplied alongside _checkout-title_, _checkout-subtitle_ and _price_. You should also supply an URL to _link_ (see above).

#### `ios-link`

A URL for an external webpage. If left empty, the button will navigate to the previous page.

#### `canonical-web-page-url`

If present, this URL will be used inside the native _Share_ button of AR QuickLook.

#### `allows-content-scaling`

If set to 0, disables the pinch scaling feature. If omitted, default to 1 (pinch scaling feature enabled).

## Deferred initialization

You can initialize any `ar-button` programmatically with JavaScript.

- Add the `deferred` attribute to your `ar-button` component:

```html
<ar-button id="my-ar-button" deferred>View in your space</ar-button>
```

- Import the module and use the `init()` function:

```javascript
import { init } from 'https://unpkg.com/@wonder-partners/ar-button@1.0.0/main.min.js';

const arButton = document.getElementById('my-ar-button');

init({
  element: arButton,
  iosConf: {
    src: 'https://github.com/leoncvlt/ar-button/raw/master/assets/Astronaut.usdz',
    checkoutTitle: 'My Product',
    checkoutSubtitle: 'This is my product description',
    callToAction: 'Buy',
    canonicalWebPageURL: 'https://google.com',
    allowsContentScaling: false,
    price: '$100',
    link: 'https://google.com',
  },
  androidConf: {
    src: 'https://github.com/leoncvlt/ar-button/raw/master/assets/Astronaut.glb',
    title: 'My Product',
    link: 'https://google.com',
    fallbackURL: 'https://google.com',
    occlusion: false,
  },
});
```

### Configuration object

When initializing an `ar-button` programmatically, you need to pass a configuration object to the `init()` function:

```javascript
{
  element: Element,
  iosConf?: {
    src: string,
    checkoutTitle?: string | undefined,
    checkoutSubtitle?: string | undefined,
    callToAction?: string | undefined,
    canonicalWebPageURL?: string | undefined,
    allowsContentScaling?: boolean | undefined,
    price?: string | undefined,
    link?: string | undefined,
  } | undefined,
  androidConf?: {
    src: string,
    title?: string | undefined,
    link?: string | undefined,
    fallbackURL?: string | undefined,
    occlusion?: boolean | undefined,
  } | undefined,
}
```

### FAQ

**Q:** _Why can't I see my custom action in AR Quick Look?_

**R:** Make sure that at least the `checkout-title`, `checkout-subtitle` (can be an non-breaking space) and `call-to-action` attributes are correctly filled.

**Q:** _Why can't I open AR on iOS within Chrome based browsers?_

**R:** There is a false negative when checking AR Quicklook compatibility on chrome based browsers. For now, we just bypass the check entirely on those browsers to ensure compatibility. See the official bug report here: [https://bugs.webkit.org/show_bug.cgi?id=239135](https://bugs.webkit.org/show_bug.cgi?id=239135)
