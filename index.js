// @ts-check

const isMobile = {
  Android() {
    return /android/i.test(navigator.userAgent);
  },
  iOS() {
    return /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
  },
};

function activateAR(href, link) {
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
    }
  }

  anchor.setAttribute('href', href);
  document.body.appendChild(anchor);
  anchor.click();
}

function initializeARButton(button) {
  if (button.getAttribute('ar') !== null) {
    return;
  }

  let href = '';
  const link = button.getAttribute('link');

  if (isMobile.iOS()) {
    button.setAttribute('ar', 'quick-look');

    const src = button.getAttribute('ios-src');
    const checkoutTitle = button.getAttribute('checkout-title');
    const checkoutSubtitle = button.getAttribute('checkout-subtitle');
    const price = button.getAttribute('price');
    const callToAction = button.getAttribute('call-to-action');
    const canonicalWebPageURL = button.getAttribute('canonical-web-page-url');
    const allowsContentScaling = button.getAttribute('allows-content-scaling');

    href = `${src}#`;

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
  } else if (isMobile.Android()) {
    button.setAttribute('ar', 'scene-viewer');

    const src = button.getAttribute('src');
    const fallbackURL = button.getAttribute('fallback-url') ?? 'https://developers.google.com/ar';
    const title = button.getAttribute('title');
    const occlusion = button.getAttribute('occlusion');

    href = `intent://arvr.google.com/scene-viewer/1.0?file=${src}&mode=ar_only`;

    if (!occlusion) {
      href += '&disable_occlusion=true';
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
  } else {
    console.warn('This platform does not support AR.');
    return;
  }
  button.addEventListener('click', () => {
    activateAR(href, link);
  });
}

window.addEventListener('load', () => {
  const buttons = document.querySelectorAll('ar-button');
  for (let i = 0; i < buttons.length; i += 1) {
    const button = buttons.item(i);
    initializeARButton(button);
  }
});
