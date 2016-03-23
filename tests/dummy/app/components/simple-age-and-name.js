// BEGIN-SNIPPET simple-name-and-age
import Ember from 'ember';
import {
  computedValidator,
  lengthBetween,
  integer
} from 'computed-validator';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.user = {};
  },

  validator: computedValidator('user', {
    name: lengthBetween(2, Infinity),
    age: integer()
  })
});
// END-SNIPPET
