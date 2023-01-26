// @ts-check
const DEFERRED = 'deferred';

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
 * @param {string} href
 * @param {string} [link]
 */
function openARView(href, link = '') {
  const anchor = document.createElement('a');
  anchor.setAttribute('id', 'ar-anchor');

  if (isMobile.iOS()) {
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
  }

  anchor.setAttribute('href', href);
  document.body.appendChild(anchor);
  anchor.click();
}

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

  button.addEventListener('click', () => openARView(href, link));
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

  button.addEventListener('click', () => openARView(href));
}

function autoInit() {
  if (!isMobile.any()) {
    console.error('This platform does not support AR.');
    return;
  }

  const buttons = document.querySelectorAll('ar-button');

  buttons.forEach((b) => {
    if (b.hasAttribute(DEFERRED)) return;
    if (isMobile.iOS()) initIOS(b);
    else initAndroid(b);
  });
}

/**
 * @param {object} config
 *
 * @param {Element} config.element
 *
 * @param {object} [config.androidConf]
 * @param {string} config.androidConf.src
 * @param {string} config.androidConf.title
 * @param {string} config.androidConf.link
 * @param {string} [config.androidConf.fallbackURL]
 * @param {boolean} [config.androidConf.occlusion]
 *
 * @param {object} [config.iosConf]
 * @param {string} config.iosConf.src
 * @param {string} config.iosConf.checkoutTitle
 * @param {string} [config.iosConf.checkoutSubtitle]
 * @param {string} [config.iosConf.link]
 * @param {string} config.iosConf.callToAction
 * @param {string} [config.iosConf.price]
 * @param {string} [config.iosConf.canonicalWebPageURL] By default, the link to the model itself.
 * @param {boolean} [config.iosConf.allowsContentScaling]
 */
function init({ element, androidConf, iosConf }) {
  ensure(element, 'element cannot be null');

  element.removeAttribute(DEFERRED);

  if (isMobile.Android() && androidConf) {
    ensure(androidConf.src, 'src cannot be null, undefined or empty.');

    element.setAttribute('src', androidConf.src);

    if (androidConf.title) element.setAttribute('title', androidConf.title);
    if (androidConf.link) element.setAttribute('link', androidConf.link);
    if (androidConf.fallbackURL) element.setAttribute('fallback-url', androidConf.fallbackURL);
    if (androidConf.occlusion && androidConf.occlusion === true) element.setAttribute('occlusion', '');

    initAndroid(element);
  }

  if (isMobile.iOS() && iosConf) {
    ensure(iosConf.src, 'src cannot be null, undefined or empty.');

    iosConf.checkoutSubtitle ??= 'ㅤ';
    iosConf.price ??= '';

    element.setAttribute('ios-src', iosConf.src);
    element.setAttribute('checkout-title', iosConf.checkoutTitle);
    element.setAttribute('checkout-subtitle', iosConf.checkoutSubtitle);
    element.setAttribute('price', iosConf.price);

    if (iosConf.link) element.setAttribute('ios-link', iosConf.link);
    if (iosConf.callToAction) element.setAttribute('call-to-action', iosConf.callToAction);
    if (iosConf.canonicalWebPageURL) element.setAttribute('canonical-web-page-url', iosConf.canonicalWebPageURL);
    if (iosConf.allowsContentScaling) {
      element.setAttribute('allows-content-scaling', iosConf.allowsContentScaling ? '1' : '0');
    }

    initIOS(element);
  }
}

autoInit();

export { init };
