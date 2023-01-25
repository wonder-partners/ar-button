// @ts-check

class RequirementError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Requirement Error';
  }
}

/**
 * @param {*} condition The condition to check.
 * @param {string} message Custom error message.
 * @returns {boolean}
 */
function ensure(condition, message = '') {
  if (!condition) {
    throw new RequirementError(message);
  }
  return true;
}

const isMobile = {
  Android: () => navigator.userAgent.match(/Android/i),
  BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
  iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
  Opera: () => navigator.userAgent.match(/Opera Mini/i),
  Windows: () => navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i),
  any: () => isMobile.Android()
    || isMobile.BlackBerry()
    || isMobile.iOS()
    || isMobile.Opera()
    || isMobile.Windows(),
};

/**
 * @param {Element} button
 */
function initIOS(button) {
  button.setAttribute('ar', 'quick-look');

  const src = button.getAttribute('ios-src');
  const checkoutTitle = button.getAttribute('checkout-title');
  const checkoutSubtitle = button.getAttribute('checkout-subtitle');
  const price = button.getAttribute('price');
  const link = button.getAttribute('ios-link') ?? '';
  const callToAction = button.getAttribute('call-to-action');
  const canonicalWebPageURL = button.getAttribute('canonical-web-page-url');
  const allowsContentScaling = button.getAttribute('allows-content-scaling');

  let href = `${src}#`;

  if (checkoutTitle) {
    href += `&checkoutTitle=${encodeURIComponent(checkoutTitle)}`;
  }

  if (checkoutSubtitle) {
    href += `&checkoutSubtitle=${encodeURIComponent(checkoutSubtitle)}`;
  }

  if (price) {
    href += `&price=${encodeURIComponent(price)}`;
  }

  if (callToAction) {
    href += `&callToAction=${encodeURIComponent(callToAction)}`;
  }

  if (canonicalWebPageURL) {
    href += `&canonicalWebPageURL=${encodeURIComponent(canonicalWebPageURL)}`;
  }

  if (allowsContentScaling === '0') {
    href += '&allowsContentScaling=0';
  }

  button.addEventListener('click', () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('id', 'ar-anchor');

    if (anchor.relList.supports('ar')) {
      anchor.appendChild(document.createElement('img'));
      anchor.setAttribute('rel', 'ar');
      anchor.addEventListener('message', (event) => {
        // @ts-ignore
        if (event.data === '_apple_ar_quicklook_button_tapped') {
          window.location.href = link;
        }
      }, false);
    } else {
      console.error('AR is not available.');
      return;
    }

    anchor.setAttribute('href', href);
    document.body.appendChild(anchor);
    anchor.click();
  });
}

/**
 * @param {Element} button
 */
function initAndroid(button) {
  button.setAttribute('ar', 'scene-viewer');

  const src = button.getAttribute('src');
  const fallbackURL = button.getAttribute('fallback-url') ?? 'https://developers.google.com/ar';
  const title = button.getAttribute('title');
  const link = button.getAttribute('link');
  const occlusion = button.hasAttribute('occlusion');

  let href = `intent://arvr.google.com/scene-viewer/1.0?file=${src}&mode=ar_only`;

  if (!occlusion) {
    href += '&disable_occlusion=true';
    console.log('occlusion is disabled');
  }

  if (title) {
    href += `&title=${encodeURIComponent(title)}`;
  }

  if (link) {
    href += `&link=${link}`;
  }

  href += '#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;';
  href += `S.browser_fallback_url=${encodeURIComponent(fallbackURL)};`;
  href += 'end;';

  button.addEventListener('click', () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('id', 'ar-anchor');
    anchor.setAttribute('href', href);
    document.body.appendChild(anchor);
    anchor.click();
  });
}

function autoInit() {
  if (!isMobile.any()) {
    console.error('This platform does not support AR.');
    return;
  }

  const buttons = document.querySelectorAll('ar-button');

  buttons.forEach((b) => {
    if (isMobile.iOS()) initIOS(b);
    else initAndroid(b);
  });
}

/**
 * @param {Element} element
 * @param {string} src
 * @param {string} iosSrc
 *
 * @param {object} [androidConfig]
 * @param {string} androidConfig.title
 * @param {string} androidConfig.link
 * @param {string} [androidConfig.fallbackURL]
 * @param {boolean} [androidConfig.occlusion]
 *
 * @param {object} [iOSConfig]
 * @param {string} iOSConfig.checkoutTitle
 * @param {string} iOSConfig.checkoutSubtitle
 * @param {string} iOSConfig.link
 * @param {string} iOSConfig.callToAction
 * @param {string} [iOSConfig.price]
 * @param {string} [iOSConfig.canonicalWebPageURL]
 * @param {boolean} [iOSConfig.allowsContentScaling]
 */
function init(element, src, iosSrc, androidConfig, iOSConfig) {
  ensure(element, 'element cannot be null');
  ensure(src, 'src cannot be null, undefined or empty.');
  ensure(iosSrc, 'iosSrc cannot be null, undefined or empty.');

  element.setAttribute('src', src);
  element.setAttribute('ios-src', iosSrc);

  if (androidConfig) {
    const {
      title, link, fallbackURL, occlusion,
    } = androidConfig;

    element.setAttribute('title', title);
    element.setAttribute('link', link);
    element.setAttribute('fallbackURL', fallbackURL ?? 'https://developers.google.com/ar');

    if (occlusion && occlusion === true) {
      element.setAttribute('occlusion', '');
    }
  }

  if (iOSConfig) {
    const {
      checkoutTitle,
      checkoutSubtitle,
      callToAction,
      price,
      canonicalWebPageURL,
      allowsContentScaling,
    } = iOSConfig;

    element.setAttribute('checkoutTitle', checkoutTitle);
    element.setAttribute('checkoutSubtitle', checkoutSubtitle);
    element.setAttribute('callToAction', callToAction);
    element.setAttribute('price', price ?? '');
    element.setAttribute('allows-content-scaling', (allowsContentScaling && allowsContentScaling === true) ? '1' : '0');

    if (canonicalWebPageURL) {
      element.setAttribute('canonicalWebPageUR', canonicalWebPageURL);
    }
  }

  if (isMobile.iOS()) initIOS(element);
  else initAndroid(element);

  console.log('init', {
    src, iosSrc, androidConfig, iOSConfig,
  });
}

window.addEventListener('DOMContentLoaded', autoInit);

export { init };
