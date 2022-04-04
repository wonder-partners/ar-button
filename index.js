const isMobile = {
  Android() {
    return /android/i.test(navigator.userAgent);
  },
  iOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },
};

function activateAR(href) {
  const anchor = document.createElement('a');
  anchor.setAttribute('href', href);

  if (isMobile.iOS()) {
    if (anchor.relList.supports('ar')) {
      anchor.appendChild(document.createElement('img'));
      anchor.setAttribute('rel', 'ar');
    } else {
      console.error('AR is not available.');
    }
  }
  anchor.click();
}

function initializeARButton(button) {
  if (button.getAttribute('ar') !== null) {
    return;
  }

  let href = '';

  if (isMobile.iOS()) {
    button.setAttribute('ar', 'quick-look');

    const src = button.getAttribute('ios-src');
    const checkoutTitle = button.getAttribute('checkout-title');
    const checkoutSubtitle = button.getAttribute('checkout-subtitle');
    const price = button.getAttribute('price');
    const callToAction = button.getAttribute('call-to-action');

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
    console.log(href);
  } else if (isMobile.Android()) {
    button.setAttribute('ar', 'scene-viewer');

    const src = button.getAttribute('src');
    const fallbackURL = button.getAttribute('fallback-url') ?? 'https://developers.google.com/ar';
    const title = button.getAttribute('title');
    const link = button.getAttribute('link');

    href = `intent://arvr.google.com/scene-viewer/1.0?file=${src}&mode=ar_only`;

    if (title) {
      href += `&title=${encodeURIComponent(title)}`;
    }

    if (link) {
      href += `&link=${encodeURIComponent(link)}`;
    }

    href += '#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;';
    href += `S.browser_fallback_url=${encodeURIComponent(fallbackURL)};`;
    href += 'end;';
    console.log(href);
  } else {
    console.warn('This platform does not support AR.');
    return;
  }
  button.addEventListener('click', () => {
    activateAR(href);
  });
}

window.addEventListener('load', () => {
  const buttons = document.querySelectorAll('ar-button');
  for (let i = 0; i < buttons.length; i += 1) {
    const button = buttons.item(i);
    initializeARButton(button);
  }
});
