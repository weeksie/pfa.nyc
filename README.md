# Hi! This is a super basic brochure for pfa.nyc

Why put my consulting microsite on github? Well, just so you can see
how I code small things, I suppose. Also, it's a good way to walk
through a few examples.

The site is super basic: one web font; no big fat js frameworks; about
10k of uncompressed css.

## Landing page

I like a conversational tone and I felt the fade in worked nicely with
that. These are simple CSS transitions and inside the home page
javascript object I wait on the `transitionend` event (vendor prefixed
because it is still new-ish.)

```javascript
$firstH1.one(TRANSITION_END_EVENT, () => {
  $secondH1.addClass('fade-in');
}).addClass('fade-in');
```

Not much to see there. In fact that part of the landing page is simple
enough that it is the only stateful part of the site that isn't
managed through Redux, though perhaps it could be.

### Dropdown menu

This gets a little more involved because I wanted the dropdown menut
to work across a variety of inputs: touchscreen,
focus/find-as-you-type, and mouseover/click. Hey, that's a lot of
state to manage, sounds like a job for unidirectional data.

The thing is, I wanted to keep this site super lightweight. It's a
frickin' brochure page, it should load in less than a second. React is
great, but if I just need state management I can get away with using
Redux on its own.

The actions:

```javascript
import { setProblems, setIndex, focus, blur, match, go, up, down } from './actions';
```

`problems` come from the `ul` on the home page:

```slim
#response
  h2.invisible YES! We have
    span &nbsp;
    span.problem-type
      input type="text" placeholder="a . . ."
      ul#problems
        li data-value="javascript-project" a javascript project
        li data-value="elixir-project" an elixir project
        li data-value="rails-project" a rails project
        li data-value="mentoring" a team in need of guidance
        li data-value="project-rescue" #omghelp!
```

These are easy enough to grab in the `ProblemMenu` constructor

```javascript
const . . .
          $lis        = $menu.find('li'),
          problems    = $lis.toArray().map((li) => {
            const $li = $(li);
            return [ $li.data('value'), $li.text() ];
          });
. . .

setProblems(problems);
```

The pattern I used with these lightweight view objects was like so:

```javascript
this.setState(store.getState(), false);
store.subscribe(() => this.setState(store.getState()));
```

And setState is easy enough:

```javascript
setState({ autocomplete, menu, input }, shouldRender = true) {
  this.state = {
    isFocused: input.isFocused,
    selectedItem: menu.index,
    activeItems: autocomplete.active,
    inputValue: input.value
  };

  if(shouldRender) {
    this.render();
  }
}
```

These views kinda mix up the React notion of props and state and it
just doesn't matter for a project this small. If that was important,
well, I'd be using React instead of rolling my own ad hoc thing for the
grand total of three views that exist on the site.

As you can see at the bottom, a call to `render` is made when the
state changes. That method looks like this:

```javascript
render() {
  const { isFocused, selectedItem, activeItems, inputValue } = this.state;
  this.$lis.removeClass('selected hidden');

  if(isFocused) {
    this.$type.addClass('active');
    this.$lis.toArray().forEach((li, i) => {
      if(activeItems.indexOf(i) === -1) {
        $(li).addClass('hidden');
      }
    });

    if(selectedItem !== null) {
      this.$lis.eq(selectedItem).addClass('selected');
    }
  } else {
    this.$type.removeClass('active');
  }

  this.$input.val(inputValue);
}
```

This isn't as pure as a react render method that just returns a bunch
of nodes. We mutate the DOM in place and all sorts of other things
that would be a no-no if I was worried about other components touching
the same part of the page.

Anyway, that's about it. You can see more
at [problem-menu.js](web/static/js/problem-menu.js). For touch
devices, I instead load the even simpler [touch-problem-menu.js](web/static/js/touch-problem-menu.js)

Ta-da.

## That Easter Egg 🥚

If you let a page sit still without clicking on it for four minutes
or so you will eventually see my trusty hound, Henry pop his head up
from the bottom left corner of the page.

I shoved this off on Redux as well. It's a very simple canvas
animation with a cubic easing function thrown in to make it look less
mechanical.

There are really good libraries out there for managing animations with
Redux and React but, again, they were overkill for the purpose.

Most of the logic is in two actions, `startEgg` and `eggTick`.

```javascript
startEgg({
  boundX,
  boundY,
  pixelsPerTick: randSpeed(),
  objectWidth: this.image.width,
  objectHeight: this.image.height
});
```

We pass the bounding box, our (average) speed, and our object
(henry.png) width.

Insde the startEgg action:

```javascript
export function startEgg({ pixelsPerTick, boundX, boundY, objectWidth, objectHeight, maxLaps }) {
  const startY          = boundY + objectHeight,
        endY            = boundY - objectHeight,
        totalDistance   = endY - startY,
        totalIterations = Math.ceil(toPos(totalDistance / pixelsPerTick));
```

First we grab Henry's starting position and his ending position. We're
only grabbing the Y axis because he's groundhogging.

Then, once we can figure out his total travelling distance, we can
figure out how many times we'll have to "tick" the animation to get
him from point A to point B.

```javascript
  const { timer } = getState("egg");

  if(timer) {
    clearInterval(timer);
  }
```
Here we clear any countdown timers. A timer id could be in the state
either from the initial countdown, or from a pause between Henry's
"laps". More on that when we get to the `eggTick` action.

```javascript
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
```

So now we have all of our starting values. The maximum number of times
Henry will pop his head up before we reset the values (laps). And of
course, we know that he's going to start off by moving up.


```javascript
export function eggTick() {
  const {
   . . . // destructure the egg state
  } = getState("egg");


  if(doCancel || x === undefined) {
    return;
  }
```

We duck right out of here if we've been sent a cancel signal or our
position is undefined (which would be the case with a `resetAll`).

Next, we have to figure out our direction and increment the iteration
counter.

```javascript

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
```

Next, we check to see if we're done with our current run. Take a
little breather for the CPU (because bitmap animations are slow), and
then start the process again.

```javascript
  if(newLaps > maxLaps) {
    delayEgg(2000); // nobody wants to hear their fan just because a dog is looking at them.
  } else {
```

Otherwise we set up the animation loop and dispatch the coordinates of
our friendly little companion pup.

```javascript
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
```

So there you have it. The code for this stuff:

* View [easter-egg.js](web/static/js/easter-egg.js)
* Actions [actions.js](web/static/js/actions.js)
* Store/Reducers [store.js](web/static/js/store.js)

### Konami code

Oh yeah! You can also summon Henry by invoking the hallowed Konami
Code: UP, UP, DOWN, DOWN, LEFT, RIGHT, LEFT, RIGHT, B, A.

That was about 30 lines of code, too.

First, for easy comparison I colapsed all of the key codes into a string.

```javascript
export const KONAMI  = "38384040373937396665";
```

Then I rigged up the listener:

```javascript
$(window).on('keydown', (e) => {
  if(e.which === KEY_ESC) {
    stopEgg();
  } else {
    konami(e.which, { objectWidth: this.image.width, objectHeight: this.image.height });
  }
});
```

Had to grab the object bounds to pass in on the call because it's the
only thing I couldn't just grab or infer from inside the action, since
when we've received all our keystrokes we'll have to actually start
the animation.

The action:

```javascript
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
```

First, there's the easy case that we have the whole code. This is the
success case and we start the animation. Otherwise, we check to see if
we're on the right track:

```javascript
  } else if(KONAMI.match(new RegExp(`^${nextKonami}`))) {
    store.dispatch({
      type: KONAMI_CODE,
      konami: nextKonami
    });
```

In that case, we pass the next konami state and wait to see if we find a match.

Finally, if the current buffer of key codes doesn't match, we reset our buffer:

```javascript
} else {
    store.dispatch({
      type: KONAMI_CODE,
      konami: ""
    });
  }
}
```

Easy as pie. The tests for that:

```javascript
describe('Konami Code', () => {
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
```
:*
