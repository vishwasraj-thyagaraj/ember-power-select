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
    let selectInput = document.querySelector(`[data-id="ember-power-select-search-input-trigger-${get(this.select, 'uniqueId')}"]`);
    if(selectInput) {
      later(() => {
        get(this.select, 'isOpen') && selectInput.select();
      });
    }

    if(this.get('fieldId')) {
      let labelEl = document.querySelector(`label[id="${this.get('fieldId')}"]`);
      // if input is rendered with fieldId as "id" attribute there will be duplicate of it on the label element as well
      labelEl && labelEl.removeAttribute('id');
    }
  },
  
  willDestroyElement() {
    this._super(...arguments);
    scheduleOnce('actions', this, this.select.actions.search, '');
  }
});
