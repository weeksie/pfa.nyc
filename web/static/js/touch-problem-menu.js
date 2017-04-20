import $ from 'jquery';
import store from './store';
import { setProblems, setIndex, focus, blur, match, go, up, down } from './actions';

export default class TouchProblemMenu {
  constructor(jQueryArgs) {
    const $lis        = $(jQueryArgs).find('li'),
          problems    = $lis.toArray().map((li) => {
            const $li = $(li);
            return [ $li.data('value'), $li.text() ];
          });

    this.$lis   = $lis;

    setProblems(problems);
    setIndex(undefined);
    this.setState(store.getState(), false);
    store.subscribe(() => this.setState(store.getState()));

    $lis.on('touchstart', (e) => {
      e.stopPropagation();
      setIndex($(e.currentTarget).index());
      go();
    })
  }

  setState({ autocomplete, menu, input }, shouldRender = true) {
    this.state = {
      selectedItem: menu.index
    };

    if(shouldRender) {
      this.render();
    }
  }

  render() {
    const { selectedItem } = this.state;

    this.$lis.removeClass('selected');

    if(selectedItem !== undefined) {
      this.$lis.eq(selectedItem).addClass('selected');
    }
  }
}
