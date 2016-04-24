import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  lengthInRange
} from 'computed-validator';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.user = {};
  },

  layout: hbs`
    {{validated-field
      label="Name"
      value=user.name
      errors=validator.name.errors}}
  `,

  // BEGIN-SNIPPET length-in-range-example-validator
  validator: computedValidator('user', {
    name: lengthInRange(0, 5)
  })
  // END-SNIPPET
});
