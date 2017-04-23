import store from './store';

import { RESET_ALL, SET_PROBLEMS, SET_INDEX, SET_VALUE, MATCH,
         MOVE_SELECTION, RESET_INPUT, BLUR, FOCUS, GO,
         MUTE, UNMUTE, EGG_START, EGG_STOP, EGG_COUNTDOWN_START,
         EGG_COUNTDOWN_CANCEL, EGG_COUNTDOWN_TICK, EGG_TICK } from './action-types';

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
    clearInterval(timer);
  }

  store.dispatch({
    type: EGG_STOP,
    secondsLeft: undefined
  });
}

export function startEgg({ pixelsPerTick, boundX, boundY, objectWidth, objectHeight, maxLaps }) {
  const startY          = boundY + (objectHeight * 2),
        endY            = boundY - objectHeight,
        totalDistance   = endY - startY,
        totalIterations = toPos(totalDistance / pixelsPerTick);

  const { timer } = getState("egg");

  // all of thse need to be consolidated
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
    objectHeight,
  });
  // start the animation
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


  if(doCancel) {
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
    startEgg(getState("egg", { pixelsPerTick: randSpeed() }));
  } else {
    if('requestAnimationFrame' in window){
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


/*** utils ***/

export function randSpeed() {
  return 1 + Math.random() * 5;
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
