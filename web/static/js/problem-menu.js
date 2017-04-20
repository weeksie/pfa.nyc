import $ from 'jquery';
import store from './store';
import { setProblems, setIndex, focus, blur, match, go, up, down } from './actions';
import { ENTER, UP_ARROW, DOWN_ARROW } from './keycodes';

export default class ProblemMenu {
  constructor(jQueryArgs) {
    const $menu       = $(jQueryArgs),
          $input      = $menu.find('input'),
          $type       = $(".problem-type"),
          $lis        = $menu.find('li'),
          problems    = $lis.toArray().map((li) => {
            const $li = $(li);
            return [ $li.data('value'), $li.text() ];
          });

    this.$menu  = $menu;
    this.$input = $input;
    this.$type  = $type;
    this.$lis   = $lis;

    setProblems(problems);
    this.setState(store.getState(), false);
    store.subscribe(() => this.setState(store.getState()));

    $input.on('focus', (e) => {
      focus($input.val());
    });

    $input.on('blur', (e) => {
      blur($input.val());
    });

    $input.on('keyup', (e) => {
      switch(e.which) {
        case ENTER:
          $input.blur();
          go();
          break;
        case DOWN_ARROW:
          down();
          break;
        case UP_ARROW:
          up();
          break;
        default:
          match($input.val(), problems);
      }
    });

    $input.on('keydown', (e) => {
      switch(e.which) {
        case ENTER: case DOWN_ARROW: case UP_ARROW:
          e.preventDefault();
          break;
        default:
          // nothing
      }
    });

    $lis.on('click', (e) => {
      e.stopPropagation();
      setIndex($(e.currentTarget).index());
      go();
    });
  }

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

    return;
  }
}
