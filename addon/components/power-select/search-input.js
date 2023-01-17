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
    let selectInput = document.querySelector(`#ember-power-select-search-input-trigger-${get(this.select, 'uniqueId')}`);
    later(() => {
      get(this.select, 'isOpen') && selectInput.select();
    });
  },
  
  willDestroyElement() {
    this._super(...arguments);
    scheduleOnce('actions', this, this.select.actions.search, '');
  }
});
