import Component from '@ember/component';
import layout from '../../templates/components/power-select/trigger';

export default Component.extend({
  layout,
  tagName: '',

  // Actions
  actions: {
    clear(e) {
      // keyboard
      if(e && e.type === 'keydown' && e.keyCode === 13) {
        e.stopPropagation();
        this.get('select').actions.select(null);
      }

      // mouse
      e.stopPropagation();
      this.get('select').actions.select(null);
      if (e.type === 'touchstart') {
        return false;
      }
    }
  }
});
