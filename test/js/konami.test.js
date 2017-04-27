import store from '../../web/static/js/store';
import { konami, resetAll } from '../../web/static/js/actions';

describe('autocomplete', () => {
  const keys = [ 38,38,40,40,37,39,37,39,66,65 ],
        args = { objectWidth: 320, objectHeight: 320 };

  beforeEach(resetAll);

  it('should start the egg', () => {
    keys.forEach(k => konami(k, args));
    const { maxLaps } = store.getState().egg;
    expect(maxLaps).toBeDefined();
  });

  it('should reset on a missed code', () => {
    let i = 0;
    for(;i<keys.length/2;i++) {
      konami(keys[i], args);
    }

    konami(99, args);

    expect(store.getState().egg.konami).toEqual("");
  });

});
