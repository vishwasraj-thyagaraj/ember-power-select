import Component from '@ember/component';
import layout from '../../templates/components/power-select/trigger';

export default Component.extend({
  layout,
  tagName: '',

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
    }
  }
  
});
