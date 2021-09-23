import Component from '@ember/component';

import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { scheduleOnce, later } from '@ember/runloop';

import layout from '../../templates/components/power-select/before-options';

export default Component.extend({
  tagName: '',
  layout,
  autofocus: true,

  getSelectedOption: computed('selectedOption', function() {
    let field = this.get('searchField');
    return field ? this.get(`selectedOption.${field}`) : this.get('selectedOption');
  }),

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);

    if (this.get('autofocus')) {
      this.focusInput();
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.get('searchEnabled')) {
      scheduleOnce('actions', this, this.get('select').actions.search, '');
    }
  },

  // Actions
  actions: {
    onKeydown(e) {
      let onKeydown = this.get('onKeydown');
      if (onKeydown(e) === false) {
        return false;
      }
      if (e.keyCode === 13) {
        let select = this.get('select');
        select.actions.close(e);
      }
    },
    onBlur(e) {
      this.sendAction('onBlur', e);
      if(isEmpty(event.target.value)) {
        let field = this.get('searchField');
        event.target.value = field ? this.get(`selectedOption.${field}`) : this.get('selectedOption');
      }
    }
  },

  // Methods
  focusInput() {
    this.input = document.querySelector(`.ember-power-select-search-input[aria-controls="${this.get('listboxId')}"]`);
    if (this.input) {
      later(this.input, 'focus', 0);
    }
  }
});
