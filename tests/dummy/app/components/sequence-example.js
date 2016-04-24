import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  sequence,
  required,
  integer,
  inRange
} from 'computed-validator';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.user = {};
  },

  layout: hbs`
    {{validated-field
      label="Age"
      value=user.age
      errors=validator.age.errors}}
  `,

  // BEGIN-SNIPPET sequence-example-validator
  validator: computedValidator('user', {
    age: sequence(required(), integer(), inRange(21, 100))
  })
  // END-SNIPPET
});
