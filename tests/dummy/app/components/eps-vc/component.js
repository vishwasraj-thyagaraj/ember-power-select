import Component from '@ember/component';
import { get, set } from '@ember/object';
import { A } from '@ember/array';

import { USERNAMES } from '../../constants/usernames';
import ParallelJS from '../../utils/parallel';

let t0, t1;

function filterNames(data) {
  let arr = [];
  for(let i=0; i<data.length; i++) {
    let option = data[i];
    if(option['name'].toUpperCase().indexOf('Vishwas'.toUpperCase()) >= 0) {
      arr.push(option);
    }
  }
  return arr;
}

t0 = performance.now();
let users = [];
for (let i = 0, j = USERNAMES.length; i < j; i += 10000) {
  let p = new ParallelJS(USERNAMES.slice(i , i + 10000));
  p.spawn(filterNames).then(function (data) {
    users = [...users, ...data];
  });
}
t1 = performance.now();
console.log(`Multi Threaded took ${t1 - t0} milliseconds.`);

t0 = performance.now();
filterNames(USERNAMES);
t1 = performance.now();
console.log(`Single Threaded loop took ${t1 - t0} milliseconds.`);

export default Component.extend({
  selected: null,
  options: USERNAMES,
  actions: {
    onchange(option) {
      set(this, 'selected', option);
    }
  }
});
