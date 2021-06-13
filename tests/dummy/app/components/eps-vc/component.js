import Component from '@ember/component';
import { get, set } from '@ember/object';
import { A } from '@ember/array';

import { USERNAMES } from '../../constants/usernames';
import ParallelJS from '../../utils/parallel';

window.users = [];

for (let i = 0, j = USERNAMES.length; i < j; i += 10000) {
  let p = new ParallelJS(USERNAMES.slice(i , i + 10000));
  p.spawn(function (data) {
    let arr = [];
    for(let i=0; i<data.length; i++) {
      let option = data[i];
      if(option['name'].toUpperCase().indexOf('vishwas'.toUpperCase()) >= 0) {
        arr.push(option);
      }
    }
    return arr;
  }).then(function (data) {
    users = [...users, ...data];
    console.log(users);
  });
}

export default Component.extend({
  selected: null,
  options: USERNAMES,
  actions: {
    onchange(option) {
      set(this, 'selected', option);
    }
  }
});
