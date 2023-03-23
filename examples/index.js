import { init, isARQuickLookCompatible, isChromeIOS } from '../main.js';

const arButton = document.getElementById('ar-button-3');

init({
  element: arButton,
  iosConf: {
    src: 'https://github.com/leoncvlt/ar-button/raw/master/assets/Astronaut.usdz',
    checkoutTitle: 'My Cool Product',
    checkoutSubtitle: 'This is my cool product description',
    callToAction: 'Buy',
    canonicalWebPageURL: 'https://wonder-partners.com',
    allowsContentScaling: true,
    price: '$100',
    link: 'https://wonder-partners.com',
  },
  androidConf: {
    src: 'https://github.com/leoncvlt/ar-button/raw/master/assets/Astronaut.glb',
    title: 'My Cool Product',
    link: 'https://wonder-partners.com',
    fallbackURL: 'https://wonder-partners.com',
    occlusion: false,
  },
});

const p = document.getElementById('quick-look-compatibility');
p.innerText = `AR Quick Look compatibility: ${isARQuickLookCompatible()}`;

const chromeBasedBrowser = document.getElementById('chrome-based-browser');
chromeBasedBrowser.innerText = 'Is Chrome iOS: ' + isChromeIOS();
