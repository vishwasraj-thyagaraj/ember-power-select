import Controller from '@ember/controller';
import { set } from '@ember/object';

export default Controller.extend({
  names: [
    { id: 1, name: 'John' }, 
    { id: 2, name: 'Andrea' }, 
    { id: 3, name: 'Peter' }, 
    { id: 4, name: 'Paul' },
    { id: 5, name: 'FS' }
  ],
  actions: {
    changeName(attribute, selected) {
      set(this, attribute, selected);
    }
  }
});
