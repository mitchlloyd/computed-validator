import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  confirmed
} from 'computed-validator';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.user = {};
  },

  layout: hbs`
    {{simple-field label="Password" value=user.password}}
    {{validated-field
      label="Password confirmation"
      value=user.passwordConfirmation
      errors=validator.passwordConfirmation.errors}}
  `,

  // BEGIN-SNIPPET confirmed-example-validator
  validator: computedValidator('user', {
    passwordConfirmation: confirmed('password')
  })
  // END-SNIPPET
});
