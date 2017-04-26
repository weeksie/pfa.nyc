import 'phoenix_html'
import Turbolinks from 'turbolinks';
import $ from 'jquery';

import HomePage from './home-page';
import EasterEgg from './easter-egg';

import { resetAll } from './actions';

const homePage = new HomePage();
const egg      = new EasterEgg({
  target: '#egg',
  timeout: 120000
});

Turbolinks.start();

document.addEventListener('turbolinks:load', () => {
  resetAll();
  egg.run();
  homePage.run();
});
