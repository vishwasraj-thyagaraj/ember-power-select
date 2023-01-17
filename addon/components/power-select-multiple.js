import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEqual } from '@ember/utils';
import { run } from '@ember/runloop';

import layout from '../templates/components/power-select-multiple';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';

export default Component.extend({
  multiSelect: true,
  tagName: '',
  layout,
  // Config
  triggerComponent: fallbackIfUndefined('power-select-multiple/trigger'),
  beforeOptionsComponent: fallbackIfUndefined(null),
  // by default it is made as true, to render all multi select dropdown as combobox for accessibility concerns
  searchEnabled: fallbackIfUndefined(true),

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
    if (this.get('triggerComponent') === 'power-select-multiple/trigger') {
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

      this.focusInput(select);
    },

    handleFocus(select, e) {
      let action = this.get('onfocus');
      if (action) {
        action(select, e);
      }
    },

    handleKeydown(select, e) {
      let action = this.get('onkeydown');
      if (action && action(select, e) === false) {
        e.stopPropagation();
        return false;
      }
      if ((e.keyCode === 9 || e.keyCode === 13) && select.isOpen) {
        let isCtrlKeyPressed = e.metaKey || e.ctrlKey;
        !isCtrlKeyPressed && e.stopPropagation(); // We should not stop propagation when ctrl key is pressed otherwise form submt will not work when ctrl + enter is pressed
        if (select.highlighted !== undefined) {
          if (!select.selected || select.selected.indexOf(select.highlighted) === -1) {
            select.actions.choose(select.highlighted, e);
            // multi select after selection close it
            select.actions.close(e);
            return false;
          } else {
            select.actions.close(e);
            return false;
          }
        } else {
          if(this.get('allowCreateOnBlur')) {
            if(select.searchText.length >= 0 && select.results.length === 0) {
              if(this.get('allowCommaSeparatedValues')) {
                select.searchText.split(',').forEach(str => str.length >= 2 && this.customSuggestion(select, str.trim(), e));
              } else {
                this.customSuggestion(select, select.searchText.trim(), e);
              }
              run.next(() => {
                select.actions.search('');
                this.focusInput();
              });
            }
          } else {
            select.actions.close(e);
            return false;
          }
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

  customSuggestion(select, str, e) {
    let value = { __isSuggestion__: true, __value__: str };
    this.get('onchange')([value], select, event);
  },

  // Methods
  focusInput(select) {
    if (select) {
      let input = document.querySelector(`#ember-power-select-trigger-multiple-input-${select.uniqueId}`);
      run.next(() => {
        // focus to combobox input once dropdown is opened
        if(input && document.activeElement !== input) input.focus();
      });
    }
  }
});
