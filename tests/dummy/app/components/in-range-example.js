import Ember from 'ember';
import {
  computedValidator,
  inRange
} from 'computed-validator';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.user = {};
  },

  // BEGIN-SNIPPET in-range-example-validator
  validator: computedValidator('user', {
    age: inRange(21, 100)
  })
  // END-SNIPPET
});
