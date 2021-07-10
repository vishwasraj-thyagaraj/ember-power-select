import Component from '@ember/component';
import layout from '../templates/components/trigger';

export default Component.extend({
  layout,
  tagName: 'div',

  // Actions
  actions: {
    removeOption(e) {
      if(e && e.keyCode === 13) {
        e.stopPropagation();
        this.get('select').actions.select(null);
      }
    },
    clear(e) {
      e.stopPropagation();
      this.get('select').actions.select(null);
      if (e.type === 'touchstart') {
        return false;
      }
    }
  }
});
