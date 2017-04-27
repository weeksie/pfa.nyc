import store from './store';

import { KONAMI } from './constants';

import { RESET_ALL, SET_PROBLEMS, SET_INDEX, SET_VALUE, MATCH,
         MOVE_SELECTION, RESET_INPUT, BLUR, FOCUS, GO,
         EGG_START, EGG_STOP, EGG_COUNTDOWN_START, EGG_COUNTDOWN_CANCEL,
         EGG_COUNTDOWN_TICK, EGG_TICK, KONAMI_CODE } from './action-types';

export function resetAll() {
  store.dispatch({ type: RESET_ALL });
}

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

export function konami(key, { objectWidth, objectHeight }) {
  const { konami } = getState("egg"),
        nextKonami = (konami || "") + key.toString();

  if(nextKonami === KONAMI) {
    startEgg({
      pixelsPerTick: randSpeed(),
      boundX: window.innerWidth,
      boundY: window.innerHeight,
      maxLaps: 2,
      konami: "",
      objectWidth,
      objectHeight
    });
  } else if(KONAMI.match(new RegExp(`^${nextKonami}`))) {
    store.dispatch({
      type: KONAMI_CODE,
      konami: nextKonami
    });
  } else {
    store.dispatch({
      type: KONAMI_CODE,
      konami: ""
    });
  }
}

export function stopEgg() {
  const { timer } = getState('egg');
  if(timer) {
    clearInterval(timer);
  }

  store.dispatch({
    type: EGG_STOP,
    secondsLeft: undefined
  });
}

export function startEgg({ pixelsPerTick, boundX, boundY, objectWidth, objectHeight, maxLaps }) {
  const startY          = boundY + objectHeight,
        endY            = boundY - objectHeight,
        totalDistance   = endY - startY,
        totalIterations = Math.ceil(toPos(totalDistance / pixelsPerTick));

  const { timer } = getState("egg");

  // all of these clearInterval calls need to be consolidated
  if(timer) {
    clearInterval(timer);
  }

  store.dispatch({
    type: EGG_START,
    maxLaps: maxLaps || 1,
    laps: 0,
    x: 0,
    y: startY,
    iteration: 0,
    moveUp: true,
    boundX,
    boundY,
    startY,
    endY,
    totalDistance,
    totalIterations,
    objectWidth,
    objectHeight
  });

  eggTick();
}

export function startCountdown(ms) {
  const { timer } = getState('egg');

  if(timer) {
    clearInterval(timer);
  }

  const seconds  = ms / 1000,
        interval = setInterval(function() {
          const { secondsLeft, timer } = getState('egg');
          store.dispatch({
            type: EGG_COUNTDOWN_TICK,
            secondsLeft: secondsLeft - 1,
            timer
          });
          if(secondsLeft - 1 === 0) {
            clearInterval(timer);
          }
        }, 1500);

  store.dispatch({
    type: EGG_COUNTDOWN_TICK,
    secondsLeft: seconds,
    timer: interval
  });
}


export function eggTick() {
  const {
    maxLaps,
    laps,
    doCancel,
    iteration,
    totalDistance,
    totalIterations,
    moveUp,
    x,
    y,
    startY,
    endY
  } = getState("egg");


  if(doCancel || x === undefined) {
    return;
  }


  let nextIteration, nextStart, nextDistance, nextUp, newLaps;

  if(iteration < totalIterations) {
    nextIteration = iteration + 1;
    nextUp        = moveUp;
    newLaps       = laps;
  } else {
    nextIteration = 0;
    nextUp        = !moveUp;
    newLaps       = laps + 1;
  }

  if(nextUp) {
    nextStart     = startY;
    nextDistance  = endY - startY;
  } else {
    nextStart     = endY;
    nextDistance  = startY - endY;
  }

  if(newLaps > maxLaps) {
    delayEgg(2000); // nobody wants to hear their fan just because a dog is looking at them.
  } else {

    if('requestAnimationFrame' in window) {
      requestAnimationFrame(eggTick);
    }

    store.dispatch({
      type: EGG_TICK,
      iteration: nextIteration,
      totalDistance: nextDistance,
      moveUp: nextUp,
      laps: newLaps,
      x: x,
      y: easeOutCubic(nextIteration, nextStart, nextDistance, totalIterations)
    });

  }
}

export function delayEgg(wait) {
  setTimeout(() => {
    startEgg(getState("egg", { pixelsPerTick: randSpeed() }));
  }, wait);
}

/*** utils ***/

export function randSpeed() {
  return 1 + Math.random() * 11;
}

function getState(namespace, ext = { }) {
  const state = store.getState()[namespace];
  return Object.assign({ }, state, ext);
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

function toPos(n) {
  return Math.sqrt(Math.pow(n, 2));
}

function easeOutCubic(current, start, totalChange, count) {
  return totalChange * (Math.pow(current / count - 1, 3) + 1) + start;
}
