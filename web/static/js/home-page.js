import $ from "jquery";

import store from './store';
import { TRANSITION_END_EVENT, HIGHLIGHT_COLORS } from './constants';
import ProblemMenu from './problem-menu';
import TouchProblemMenu from './touch-problem-menu';

import EasterEgg from './easter-egg';


export default class HomePage {
  run() {
    if(!$("#greeting").length) {
      return;
    }
    $(document).ready(() => {
      if(this._isTouch()) {
        $('body').addClass('is-touch');
        $('.problem-type input').replaceWith('<span class="touch-placeholder">. . .</span>');
      }
      
      this.egg = new EasterEgg({
        target: "#egg",
        timeout: 3000,
        words: [
          "Elixir!",
          "Ruby!",
          "Javascrrrrrript!"          
        ]
      });
      
      this.fadeIn();
      // The transpiling is scope-fucking the variables
      // in `beginCycle` so it has to be called from here. :/
      //this.beginCycle();
      this.fastCycle();
    });
  }

  // dev only, so I don't have to wait for the fade in.
  fastCycle() {
    console.warn("*** FOR DEV ONLY: FAST CYCLE THROUGH TRANSITIONS ***");
    $("h1.invisible").addClass("fade-in");
    $(".consultant-type").addClass("fade-in");
    this.showResponse();
  }

  fadeIn() {
    $('h1.invisible:eq(0)').addClass('fade-in').one(TRANSITION_END_EVENT, () => {
      $('h1.invisible:eq(1)').addClass('fade-in');
    });
  }

  beginCycle() {
    const $consultantType = $(".consultant-type"),
          consultantTypes = $consultantType.data('consultant-type').split(','),
          transitions     = consultantTypes.length,
          self = this;

    let typeIndex = consultantTypes.indexOf('technical consultant'),
        current   = consultantTypes[typeIndex],
        hClass    = highlightClass(typeIndex),
        count     = 0;

    $consultantType.addClass('invisible first');
    $consultantType.one(TRANSITION_END_EVENT, consultantIn);

    function consultantIn() {
      $consultantType.removeClass('first');

      typeIndex = (++typeIndex) % consultantTypes.length;
      current   = consultantTypes[typeIndex];
      hClass    = highlightClass(typeIndex);

      if(current.match(/^[aeiou]/)) {
        current = `an <span class="${hClass}">${current}</span>?`;
      } else {
        current = `a <span class="${hClass}">${current}</span>?`;
      }

      if(count++ >= transitions) {
        $consultantType.html('<span class="hi-final">help</span>?');
        $consultantType.addClass('fade-in').one(TRANSITION_END_EVENT, self.showResponse.bind(self));
      } else {
        $consultantType.html(current);
        $consultantType.addClass('fade-in').one(TRANSITION_END_EVENT, consultantOut);
      }
    }

    function consultantOut() {
      $consultantType.removeClass('fade-in').one(TRANSITION_END_EVENT, consultantIn);
    }
  }

  showResponse() {
    const $response = $("#response"),
          $next     = $(".next"),
          menu      = this._isTouch()? new TouchProblemMenu($response) : new ProblemMenu($response);

    $response.find("h2").addClass('fade-in');
    $next.find('button.continue').on('click', (e) => {
      e.preventDefault();
      const url = $next.data('url');
      Turbolinks.visit(`/services/${url}`);
    });

    store.subscribe(() => {
      const { input }          = store.getState(),
            { isMatched, url } = input;

      if(isMatched) {
        $next.addClass('fade-in');
        $next.data('url', url);
        $response.addClass('matched');
      } else {
        $next.removeClass('fade-in');
        $response.removeClass('matched');
      }
    });
  }

  _isTouch() {
    return 'ontouchstart' in document.documentElement;
  }

}

function highlightClass(i) {
  return `hi-${i%HIGHLIGHT_COLORS}`;
}
