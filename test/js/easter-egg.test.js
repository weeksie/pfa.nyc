import store from '../../web/static/js/store';
import { VOLUME_ON, VOLUME_OFF } from '../../web/static/js/constants';
import { mute, unmute, startCountdown, startEgg, stopEgg, eggTick } from '../../web/static/js/actions';

describe('Easter Egg', () => {
  const INIT = {
    words: [ "elixir", "ruby", "js" ],
    x: 0,
    y: 0,
    objectWidth: 100,
    objectHeight: 200,
    boundX: 1200,
    boundY: 800
  }

  it('should move to the center of the bounds and peek above the fold', () => {
    startEgg(INIT);
    eggTick();

    const { x, y } = eggState();

    expect(x).toBe(600);
    expect(y).toBe(799);
  });
});

function eggState() {
  return store.getState().egg;
}
