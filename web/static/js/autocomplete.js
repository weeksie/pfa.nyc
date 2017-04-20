
export default class Autocomplete {
  constructor(pairs) {
    this.options = pairs.map(pair => [ pair[0], strip(pair[1]), pair[1]]);
    this.reset();
  }
  // Returns the slug for either the currently active index
  // OR if the active list only has one item it will return that slug.
  // Otherwise null.
  go() {
    if(this.active[this.index] !== undefined) {
      return this.options[this.active[this.index]];
    } else if(this.active.length === 1) {
      return this.options[this.active[0]];
    } else {
      return null;
    }
  }
  hasSelectedIndex() {
    return this.index !== null;
  }
  setIndex(i) {
    this.index = i % this.active.length;
  }
  incrementIndex() {
    if(this.index === null) {
      this.index = 0;
    } else {
      this.index = (this.index+1) % this.active.length;
    }
  }
  decrementIndex() {
    if(this.index === null) {
      this.index = this.active.length - 1;
    } else {
      this.index = (this.index - 1) % this.active.length;
    }
  }
  selectedIndex() {
    return this.index;
  }
  updateBuffer(buffer) {
    this.buffer   = strip(buffer);
    this.active   = [ ];
    this.inactive = [ ];
    this.index    = null;

    this.options.forEach((opt, i) => {
      if(opt[1].match(this.buffer)) {
        this.active.push(i);
      } else {
        this.inactive.push(i);
      }
    });
  }
  inactiveIndexes(f) {
    this.inactive.forEach(i => f(i));
  }
  reset() {
    this.active   = this.options.map((_opt, i) => i);
    this.inactive = [ ];
    this.index    = null;
    this.buffer   = null;
  }
}

function strip(str) {
  return str.replace(/[\W]/g, '');
}
