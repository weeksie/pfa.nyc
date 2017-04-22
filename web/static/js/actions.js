import store from './store';

import { SET_PROBLEMS, SET_INDEX, SET_VALUE, MATCH,
         MOVE_SELECTION, RESET_INPUT, BLUR, FOCUS, GO,
         MUTE, UNMUTE, EGG_START, EGG_STOP, EGG_COUNTDOWN_START,
         EGG_COUNTDOWN_CANCEL, EGG_COUNTDOWN_TICK, EGG_TICK } from './action-types';

export function setProblems(problems) {
  store.dispatch(mkProblems(problems, { type: SET_PROBLEMS }));
}

export function focus(value) {
  store.dispatch({
    type: FOCUS,
    value: value
  });
}

export function blur(value) {
  store.dispatch({
    type: BLUR,
    value: value
  });
}

export function match(value) {
  const stripped     = strip(value),
        { problems } = getState('autocomplete');

  store.dispatch({
    type: MATCH,
    value: value,
    active: problems.reduce((acc, [ _url, _label, slug], i) => {
      if(slug.match(stripped)) {
        return acc.concat(i);
      } else {
        return acc;
      }
    }, [ ])
  });
}

export function down() {
  store.dispatch({
    type: MOVE_SELECTION,
    direction: 1
  });
}

export function up() {
  store.dispatch({
    type: MOVE_SELECTION,
    direction: -1
  })
}

export function setIndex(n) {
  store.dispatch({
    type: SET_INDEX,
    index: n
  });
}

export function go() {
  const { autocomplete, menu } = store.getState(),
        { active, problems }   = autocomplete,
        selected               = active.length === 1? problems[active[0]] : problems[menu.index],
        [ url, label, _slug ]  = selected || [ ];

  if(url && label) {
    store.dispatch({ type: SET_VALUE, value: label });
    store.dispatch(mkProblems(problems, { type: GO, url }));
  }
}

/*** Easter eggy actions ***/

export function unmute() {
  store.dispatch({
    type: UNMUTE
  });
}

export function mute() {
  store.dispatch({
    type: MUTE
  });
}

export function stopEgg() {
  const { timer } = getState('egg');
  if(timer) {
    clearTimeout(timer);
  }

  store.dispatch({
    type: EGG_CANCEL
  });
}

export function startEgg({ words, x, y, objectWidth, objectHeight, boundX, boundY }) {
  store.dispatch({
    type: EGG_START,
    words,
    x,
    y,
    objectWidth,
    objectHeight,
    boundX,
    boundY
  });
}

export function startCountdown(ms) {
  const { timer } = getState('egg');

  if(timer) {
    clearTimeout(timer);
  }

  const seconds  = ms / 1000,
        interval = setInterval(function() {
          const { secondsLeft, timer } = getState('egg');

          if(secondsLeft > 0) {
            store.dispatch({
              type: EGG_COUNTDOWN_TICK,
              secondsLeft: secondsLeft - 1,
              timer
            });
          } else {
            clearTimeout(timer);
          }
        }, ms);

  store.dispatch({
    type: EGG_COUNTDOWN_TICK,
    secondsLeft: seconds,
    timer: interval
  });
}


export function eggTick() {
  const { wordIndex, words, x, y, boundX, boundY } = store.getState().egg;

  if(x === 0 && y === 0) {
    store.dispatch({
      type: EGG_TICK,
      x: boundX / 2,
      y: boundY - 1
    });
  }
}



/*** utils ***/

function getState(namespace) {
  return store.getState()[namespace];
}

function strip(str) {
  return str.replace(/[\W]/g, '').toLowerCase();
}

function mkProblems(pairList, state) {
  const problems = pairList.map(([url, label]) => [ url, label, strip(label) ]),
        active   = pairList.map((_prob, i) => i);

  return Object.assign({ }, state, {
    problems,
    active
  });
}
