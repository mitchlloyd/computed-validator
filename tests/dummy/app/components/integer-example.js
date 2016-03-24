import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  integer
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

  // BEGIN-SNIPPET integer-example-validator
  validator: computedValidator('user', {
    age: integer()
  })
  // END-SNIPPET
});
