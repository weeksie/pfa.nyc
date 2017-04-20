import store from './store';
import { PROBLEM_PLACEHOLDER } from './constants';

import { SET_PROBLEMS, SET_INDEX, SET_VALUE, MATCH, MOVE_SELECTION, RESET_INPUT, BLUR, FOCUS, GO } from './action-types';

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
  const stripped         = strip(value),
        { autocomplete } = store.getState();

  store.dispatch({
    type: MATCH,
    value: value,
    active: autocomplete.problems.reduce((acc, [ _url, _label, slug], i) => {
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
