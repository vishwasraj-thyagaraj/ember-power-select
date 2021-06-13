import Component from '@ember/component';
import { set } from '@ember/object';

import { USERNAMES } from '../../constants/usernames';
import ParallelJS from '../../utils/parallel';

export default Component.extend({
  selected: null,
  options: USERNAMES,
  actions: {
    onchange(option) {
      set(this, 'selected', option);
    }
  }
});
