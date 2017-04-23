// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"
import Turbolinks from "turbolinks";
import $ from 'jquery';

import HomePage from "./home-page";
import EasterEgg from './easter-egg';

import { resetAll } from './actions';

const homePage = new HomePage();
const egg      = new EasterEgg({
  target: "#egg",
  timeout: 10000
});

Turbolinks.start();

document.addEventListener("turbolinks:load", () => {
  resetAll();
  egg.run();
  homePage.run();
});
