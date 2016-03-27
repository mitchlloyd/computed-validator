import Ember from 'ember';
import {
  computedValidator,
  between
} from 'computed-validator';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.user = {};
  },

  // BEGIN-SNIPPET between-example-validator
  validator: computedValidator('user', {
    age: between(21, 100)
  })
  // END-SNIPPET
});
