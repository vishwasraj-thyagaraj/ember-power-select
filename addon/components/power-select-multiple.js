import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEqual } from '@ember/utils';
import layout from '../templates/components/power-select-multiple';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';

export default Component.extend({
  multiSelect: true,
  tagName: '',
  layout,
  // Config
  triggerComponent: fallbackIfUndefined('power-select-multiple/trigger'),
  removeButtonClassName: 'ember-power-select-multiple-remove-btn',
  beforeOptionsComponent: fallbackIfUndefined(null),

  // CPs
  shouldRenderInVC: computed('renderInVC', function() {
    return this.get('renderInVC') || this.get('options.length') > 500;
  }),

  concatenatedTriggerClass: computed('triggerClass', function() {
    let classes = ['ember-power-select-multiple-trigger'];
    if (this.get('triggerClass')) {
      classes.push(this.get('triggerClass'));
    }
    return classes.join(' ');
  }),

  selected: computed({
    get() {
      return [];
    },
    set(_, v) {
      if (v === null || v === undefined) {
        return [];
      }
      return v;
    }
  }),

  computedTabIndex: computed('tabindex', 'searchEnabled', 'triggerComponent', function() {
    if (this.get('triggerComponent') === 'power-select-multiple/trigger' && this.get('searchEnabled') !== false) {
      return '-1';
    } else {
      return this.get('tabindex');
    }
  }),

  // Actions
  actions: {
    handleOpen(select, e) {
      let action = this.get('onopen');
      if (action && action(select, e) === false) {
        return false;
      } 
      // handle option removal via button pill
      else if(e && e.keyCode === 13 && e.target.classList.contains(this.get('removeButtonClassName'))) {
        let index = parseInt(e.target.getAttribute('data-selected-index'));
        let removedItem = select.selected[index];
        select.actions.select(this.actions.buildSelection(removedItem, select), e);
        e.preventDefault();
        // once option is removed, will focus input and open the dropdown
      }

      if(!this.get('searchEnabled')) {
        let listBox = document.querySelector(`.ember-power-select-multiple-trigger[aria-owns='ember-basic-dropdown-content-${select.uniqueId}']`);
        listBox && listBox.focus();
      } else {
        this.focusInput(select);
      }
    },

    handleFocus(select, e) {
      let action = this.get('onfocus');
      if (action) {
        action(select, e);
      }
      this.focusInput(select);
    },

    handleKeydown(select, e) {
      let action = this.get('onkeydown');
      if (action && action(select, e) === false) {
        e.stopPropagation();
        return false;
      }
      if (e.keyCode === 13 && select.isOpen) {
        e.stopPropagation();
        if (select.highlighted !== undefined) {
          if (!select.selected || select.selected.indexOf(select.highlighted) === -1) {
            select.actions.choose(select.highlighted, e);
            return false;
          } else {
            select.actions.close(e);
            return false;
          }
        } else {
          select.actions.close(e);
          return false;
        }
      }
    },

    buildSelection(option, select) {
      let newSelection = (select.selected || []).slice(0);
      let idx = -1;
      for (let i = 0; i < newSelection.length; i++) {
        if (isEqual(newSelection[i], option)) {
          idx = i;
          break;
        }
      }
      if (idx > -1) {
        newSelection.splice(idx, 1);
      } else {
        newSelection.push(option);
      }
      return newSelection;
    }
  },

  // Methods
  focusInput(select) {
    if (select) {
      let input = document.querySelector(`#ember-power-select-trigger-multiple-input-${select.uniqueId}`);
      input && input.focus();
    }
  }
});
