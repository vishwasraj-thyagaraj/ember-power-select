import Component from '@ember/component';
import layout from '../../templates/components/power-select/search-input';

import { get } from '@ember/object';
import { later, scheduleOnce } from '@ember/runloop';

export default Component.extend({
  tagName: '',
  layout,
  inputType: 'search',

  didInsertElement() {
    this._super(...arguments);
    let select = this.select;
    let selectInput = document.querySelector(`#ember-power-select-search-input-trigger-${get(select, 'uniqueId')}`);
    later(() => {
      if (get(select, 'isOpen')) {
        selectInput.select();
      }
    })
    ;
  }
});
