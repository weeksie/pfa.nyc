import { createStore, combineReducers } from 'redux';
import { VOLUME_ON, VOLUME_OFF } from './constants';

import { RESET_ALL, SET_PROBLEMS, SET_VALUE, SET_INDEX, MATCH,
         MOVE_SELECTION, RESET_INPUT, BLUR, FOCUS, GO,
         EGG_START, EGG_COUNTDOWN_START, EGG_STOP, EGG_COUNTDOWN_TICK,
         EGG_TICK, KONAMI_CODE } from './action-types';

/** State Shape

    {
      autocomplete: {
        // a list of triples describing a problem
        //  e.g. [ 'javascript-project', 'javascript project', 'javascriptproject' ]
        problems: [ [ url, label, slug ] ],

        // a list of active problem indexes
        active: [ integer ]
      },

      menu: {
        // The index of the selected problem in the drop down mennu
        index: integer,

        // The number of active problems
        activeLen: integer
      },

      input: {
        // whether the input is focused
        isFocused: boolean,

        // whether a problem has been selected
        isMatched: boolean,

        // the current value of the input field
        value: string,

        // the url value of the matched problem if there is one
        url: string
      }
    }

*/

function autocomplete(state = { }, action) {
  switch(action.type) {
    case SET_PROBLEMS: case GO:
      return {
        problems: action.problems,
        active: action.active
      };
    case MATCH:
      return {
        problems: state.problems,
        active: action.active
      };
    default:
      return state;
  }
}

function menu(state = { }, action) {
  switch(action.type) {
    case SET_PROBLEMS:
      return {
        index: null,
        activeLen: action.active.length
      };
    case SET_INDEX:
      return {
        index: action.index,
        activeLen: state.activeLen
      };
    case MATCH:
      return {
        index: state.index,
        activeLen: action.active.length
      };
    case MOVE_SELECTION:
      return {
        index: state.index === null? 0 : (state.index + action.direction) % state.activeLen,
        activeLen: state.activeLen
      };
    default:
      return state;
  }
}

function input(state = { }, action) {
  switch(action.type) {
    case BLUR:
      return {
        isFocused: false
      };
    case FOCUS:
      return {
        isFocused: true
      }
    case MATCH:
      return {
        isFocused: true,
        value: action.value
      }
    case GO:
      return Object.assign({ }, state, { isMatched: true, url: action.url });
    case SET_VALUE: {
      return Object.assign({ }, state, { value: action.value });
    }
    default:
      return state;
  }
}

function egg(state = { }, action) {
  switch(action.type) {
    case KONAMI_CODE:
      return Object.assign({ }, state, {
        konami: action.konami
      });
    case EGG_COUNTDOWN_TICK:
      return {
        secondsLeft: action.secondsLeft,
        timer: action.timer
      };
    case EGG_STOP:
      return {
        doCancel: true,
        timer: state.timer
      };
    case EGG_START:
      return Object.assign({ }, action, { doStart: true, type: undefined, volume: VOLUME_OFF });
    case EGG_TICK:
      return Object.assign({ }, state, action, { type: undefined, doStart: undefined });
    default:
      return state;
  }
}

const appReducer  = combineReducers({ autocomplete, menu, input, egg });
const rootReducer = function(state, action) {
  if(action.type === RESET_ALL) {
    state = undefined;
  }
  return appReducer(state, action);
}

export default createStore(rootReducer,
                           window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
