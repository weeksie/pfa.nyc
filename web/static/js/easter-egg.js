import $ from 'jquery';
import store from './store';
import { VOLUME_ON, VOLUME_OFF, EGG_IMAGE } from './constants';
import { startCountdown, startEgg, stopEgg, mute, unmute } from './actions';

export default class EasterEgg {

  constructor({ target, timeout, words }) {
    const $egg = $(target),
          $canvas = $egg.find('canvas'),
          $volume = $egg.find('.volume');

    this.$egg      = $egg;
    this.$canvas   = $canvas;
    this.$volume   = $volume;
    this.image     = new Image();
    this.image.src = EGG_IMAGE;
    this.state     = { };
    this.timer     = setTimeout(() => {
      startCountdown(1000);
    }, timeout);

    this.setState(store.getState(), false);
    store.subscribe(() => this.setState(store.getState()));
  }

  setState({ egg }, shouldRender = true) {
    const { doCancel, secondsLeft } = egg;

    this.state = egg;

    if(secondsLeft === 0) {
      startEgg({
        x: 0,
        y: 0,
        objectWidth: this.image.width,
        objectHeight: this.image.height,
        boundX: $(window).width(),
        boundY: $(window).height()
      });
    }

    if(doCancel) {
      clearTimeout(this.timer);
      return;
    }

    if(shouldRender) {
      this.render();
    }
  }

  render() {
    const { doCancel, doStart, secondsLeft } = this.state;
    if(doCancel) {
      this.reset();
    }
    if(doStart) {
      this.animate();
    }
    if(secondsLeft !== undefined) {
      this.countdown(secondsLeft);
    }
  }

  reset() {

  }

  animate() {

  }

  countdown(secondsLeft) {
    console.log(`${secondsLeft} until the easter egg starts.`);
  }
}
