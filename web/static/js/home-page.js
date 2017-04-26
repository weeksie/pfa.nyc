import $ from 'jquery';

import store from './store';
import { stopEgg, resetAll } from './actions';
import { TRANSITION_END_EVENT, HIGHLIGHT_COLORS } from './constants';

import ProblemMenu from './problem-menu';
import TouchProblemMenu from './touch-problem-menu';
import EasterEgg from './easter-egg';

// doing state outside of Redux because it's not necessary for a simple staggered fade in.
// old school js w/jquery hurr.
export default class HomePage {
  run() {
    if(!$('#greeting').length) {
      return;
    }

    if(this._isTouch()) {
      $('body').addClass('is-touch');
      $('.problem-type input').replaceWith('<span class="touch-placeholder">. . .</span>');
    }

    /// aAAAAaaaRGGH STATE!!!!11111111
    if(this.hasRun) {
      this.fastCycle();
    } else {
      this.hasRun = true;
      this.beginCycle()
    }
  }

  // also used for dev, so I don't have to wait for the fade in.
  fastCycle() {
    $('h1.invisible').addClass('fade-in');
    $('.consultant-type').addClass('fade-in').html('<span class="hi-final">help</span>?');
    this.showResponse();
  }

  fadeIn() {
    const $firstH1  = $('h1.invisible:eq(0)'),
          $secondH1 = $('h1.invisible:eq(1)');

    // Turbolinks is weird hitting a page other than the home page
    // before navigating there. For some reason the first 'invisible'
    // h1 is already visible.
    if($firstH1.is(':visible')) {
      $firstH1.removeClass('fade-in');
    }

    $firstH1.one(TRANSITION_END_EVENT, () => {
      $secondH1.addClass('fade-in');
    }).addClass('fade-in');
  }

  beginCycle() {
    const $consultantType = $('.consultant-type'),
          consultantTypes = $consultantType.data('consultant-type').split(','),
          transitions     = consultantTypes.length,
          self = this;

    let typeIndex = consultantTypes.indexOf('technical consultant'),
        current   = consultantTypes[typeIndex],
        hClass    = highlightClass(typeIndex),
        count     = 0;

    this.fadeIn();

    $consultantType.one(TRANSITION_END_EVENT, consultantIn);
    $consultantType.addClass('invisible first');

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
    const $response = $('#response'),
          $next     = $('.next'),
          menu      = this._isTouch()? new TouchProblemMenu($response) : new ProblemMenu($response);

    $response.find('h2').addClass('fade-in');
    $next.find('button.continue').on('click', (e) => {
      e.preventDefault();
      const url = $next.data('url');
      if(url === undefined) {
        return; // handles random clicks, since the button is invisible, not display: none
      }
      stopEgg();
      resetAll();
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
