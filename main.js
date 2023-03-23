// @ts-check

class RequirementError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Requirement Error';
  }
}

const DEFERRED = 'deferred';

const isMobile = {
  Android: () => navigator.userAgent.match(/Android/i) !== null,
  BlackBerry: () => navigator.userAgent.match(/BlackBerry/i) !== null,
  iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null,
  Opera: () => navigator.userAgent.match(/Opera Mini/i) !== null,
  Windows: () => navigator.userAgent.match(/IEMobile/i) !== null
    || navigator.userAgent.match(/WPDesktop/i) !== null,
  iPadOS: () => (navigator.userAgent.includes('Mac') && 'ontouchend' in document),
  any: () => isMobile.Android()
    || isMobile.iOS()
    || isMobile.iPadOS
    || isMobile.Opera()
    || isMobile.BlackBerry()
    || isMobile.Windows(),
};

/**
 * OS version number format for apple mobile devices: major_minor_patch.
 * @returns {boolean}
 */
function isARQuickLookCompatible() {
  const anchor = document.createElement('a');
  const appleCheck = anchor.relList.supports('ar');

  if (isMobile.iOS()) {
    const match = navigator.userAgent.match(/\b[0-9]+_[0-9]+(?:_[0-9]+)?\b/);
    if (!match) return false;
    return appleCheck && Number(match[0].split('_')[0]) > 12;
  }
  return appleCheck;
}

function isChromeIOS() {
  return navigator.userAgent.match(/(crios)[/\s]([\d.]+)/ig) !== null;
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

/**
 * @param {Element} element
 * @param {string} qualifiedName
 * @returns {string | null} URI encoded attribute.
 */
function getEncodedAttr(element, qualifiedName) {
  const attr = element.getAttribute(qualifiedName);
  if (!attr) return null;
  const encodedAttr = encodeURIComponent(attr);
  return encodedAttr;
}

/**
 * @param {string} href
 * @param {string} [link]
 */
function openARView(href, link = '') {
  const anchor = document.createElement('a');
  anchor.setAttribute('id', 'ar-anchor');

  if (isMobile.iOS() || isMobile.iPadOS()) {
    if (isChromeIOS() || isARQuickLookCompatible()) {
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
  const link = button.getAttribute('ios-link') ?? button.getAttribute('link') ?? '';
  const allowsContentScaling = button.getAttribute('allows-content-scaling');

  const checkoutTitle = getEncodedAttr(button, 'checkout-title');
  const checkoutSubtitle = getEncodedAttr(button, 'checkout-subtitle');
  const price = getEncodedAttr(button, 'price');
  const callToAction = getEncodedAttr(button, 'call-to-action');
  const canonicalWebPageURL = getEncodedAttr(button, 'canonical-web-page-url');

  let href = `${src}#`;

  if (checkoutTitle) href += `&checkoutTitle=${checkoutTitle}`;
  if (checkoutSubtitle) href += `&checkoutSubtitle=${checkoutSubtitle}`;
  if (price) href += `&price=${price}`;
  if (callToAction) href += `&callToAction=${callToAction}`;
  if (canonicalWebPageURL) href += `&canonicalWebPageURL=${canonicalWebPageURL}`;
  if (allowsContentScaling === '0') href += '&allowsContentScaling=0';

  button.addEventListener('click', () => openARView(href, link));
}

/**
 * @param {Element} button
 */
function initAndroid(button) {
  button.setAttribute('ar', 'scene-viewer');

  const src = button.getAttribute('src');
  const link = button.getAttribute('link');

  const title = getEncodedAttr(button, 'title');
  const fallbackURL = getEncodedAttr(button, 'fallback-url') ?? 'https://developers.google.com/ar';

  const occlusion = button.hasAttribute('occlusion');

  let href = `intent://arvr.google.com/scene-viewer/1.0?file=${src}&mode=ar_only`;

  if (title) href += `&title=${title}`;
  if (link) href += `&link=${link}`;
  if (!occlusion) href += '&disable_occlusion=true';

  href += '#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;';
  href += `S.browser_fallback_url=${fallbackURL};`;
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
    if (isMobile.iOS() || isMobile.iPadOS()) initIOS(b);
    else if (isMobile.Android()) initAndroid(b);
  });
}

/**
 * @param {object} config
 *
 * @param {Element} config.element
 *
 * @param {object} [config.androidConf]
 * @param {string} config.androidConf.src URL to the 3D model.
 * @param {string} [config.androidConf.title] A name to be displayed in the UI.
 * @param {string} [config.androidConf.link] A URL for an external webpage. Adds a button in the UI.
 * @param {string} [config.androidConf.fallbackURL] URL to go to when the device is not supported.
 * @param {boolean} [config.androidConf.occlusion] Toggles Object blending mode.
 *
 * @param {object} [config.iosConf]
 * @param {string} config.iosConf.src URL to the 3D model.
 * @param {string} [config.iosConf.checkoutTitle] Name to display in the UI.
 * @param {string} [config.iosConf.checkoutSubtitle] Description to display bellow the name.
 * @param {string} [config.iosConf.link] URL for an external webpage. Adds a button in the UI.
 * @param {string} [config.iosConf.callToAction] Text to display in the quick look button UI.
 * @param {string} [config.iosConf.price] Price to display in the UI after the description.
 * @param {string} [config.iosConf.canonicalWebPageURL] Link used in the native share feature.
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
    if (androidConf.occlusion && androidConf.occlusion === true) {
      element.setAttribute('occlusion', '');
    }
    initAndroid(element);
  }

  if ((isMobile.iOS() || isMobile.iPadOS()) && iosConf) {
    ensure(iosConf.src, 'src cannot be null, undefined or empty.');

    iosConf.checkoutSubtitle ??= 'ㅤ';
    iosConf.price ??= '';

    element.setAttribute('ios-src', iosConf.src);
    element.setAttribute('checkout-subtitle', iosConf.checkoutSubtitle);
    element.setAttribute('price', iosConf.price);
    element.setAttribute('allows-content-scaling', iosConf.allowsContentScaling ? '1' : '0');
    
    if (iosConf.checkoutTitle) element.setAttribute('checkout-title', iosConf.checkoutTitle);
    if (iosConf.link) element.setAttribute('ios-link', iosConf.link);
    if (iosConf.callToAction) element.setAttribute('call-to-action', iosConf.callToAction);
    if (iosConf.canonicalWebPageURL)
    {
      element.setAttribute('canonical-web-page-url', iosConf.canonicalWebPageURL);
    }

    initIOS(element);
  }
}

window.addEventListener('DOMContentLoaded', autoInit);

export { init, isARQuickLookCompatible, isChromeIOS };
