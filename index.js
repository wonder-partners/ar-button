const isMobile = {
  Android() {
    return navigator.userAgent.match(/Android/i);
  },
  iOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
};

function activateAR(href) {
  if (!isMobile.iOS() || !isMobile.Android()) {
    console.error('Platform not supported');
    return;
  }

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

  const src = isMobile.Android() ? button.getAttribute('src') : button.getAttribute('ios-src');
  let href = '';

  if (isMobile.iOS()) {
    button.setAttribute('ar', 'quick-look');
    href = src;
  } else if (isMobile.Android()) {
    button.setAttribute('ar', 'scene-viewer');
    const fallbackURL = 'https://developers.google.com/ar';
    href = `intent://arvr.google.com/scene-viewer/1.0?file=${src}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=${fallbackURL};`;
    href += 'end;';
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
