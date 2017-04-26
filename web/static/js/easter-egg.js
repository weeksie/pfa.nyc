import $ from 'jquery';
import store from './store';
import { VOLUME_ON, VOLUME_OFF, EGG_IMAGE, KEY_ESC } from './constants';
import {
  // actions
  startCountdown, startEgg, stopEgg, eggTick, mute, unmute,

  // util - I know, it's an odd place to put it. couldn't be bothered
  // making a whole new file just for that.
  randSpeed
} from './actions';

export default class EasterEgg {

  constructor({ target, timeout }) {
    this.title     = document.title;
    this.timeout   = timeout;
    this.target    = target;
    this.image     = new Image();
    this.image.src = EGG_IMAGE;
    this.state     = { };
    this.run();

    this.setState(store.getState(), false);
    store.subscribe(() => this.setState(store.getState()));

    $(window).on('keydown', (e) => {
      if(e.which === KEY_ESC) stopEgg();
    });
    $(document).on('click touchend', (e) => {
      stopEgg();
    })
  }

  run() {
    stopEgg();

    this.$egg       = $(this.target);
    this.$canvas    = this.$egg.find('canvas');
    this.$volume    = this.$egg.find('.volume');
    this.$countdown = this.$egg.find('.countdown');

    if(this.timer) {
      this.timer = clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      startCountdown(10000); // start countdown at 10 seconds
    }, this.timeout);
  }

  setState({ egg }, shouldRender = true) {
    const { doCancel, secondsLeft } = egg;

    this.state = egg;

    if(secondsLeft === 0) {
      const boundX = window.innerWidth,
            boundY = window.innerHeight;

      startEgg({
        boundX,
        boundY,
        pixelsPerTick: randSpeed(),
        objectWidth: this.image.width,
        objectHeight: this.image.height
      });
    }

    if(shouldRender) {
      this.render();
    }
  }

  render() {
    const { doCancel, doStart, secondsLeft, x } = this.state;
    if(doStart) {
      this.$canvas.addClass('active');
    } else if(doCancel) {
      this.$canvas.removeClass('active');
    }

    if(secondsLeft === undefined) {
      this.$countdown.addClass('invisible');
      document.title = this.title;
    } else {
      this.$countdown.removeClass('invisible');
      this.countdown(secondsLeft);
    }

    if(x !== undefined) {
      this.animate();
    }
  }

  animate() {
    const canvas = this.$canvas[0],
          ctx    = canvas.getContext('2d'),

          { x, y, boundX, boundY,
            objectWidth, objectHeight } = this.state;

    canvas.width  = boundX;
    canvas.height = boundY;
    ctx.save();
    ctx.clearRect(0, 0, boundX, boundY);
    ctx.drawImage(this.image, x, y, objectWidth, objectHeight);
    ctx.restore();
  }

  countdown(secondsLeft) {
    let content = secondsLeft;
    if(secondsLeft === 3) {
      content = 'Almost there. . . .';
    }
    if(secondsLeft === 1) {
      content = 'Henry!';
    }
    this.$countdown.html(content);
    document.title = `(${content}) ${this.title}`;
  }
}
