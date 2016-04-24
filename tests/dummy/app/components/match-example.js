import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  match
} from 'computed-validator';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.user = {};
  },

  layout: hbs`
    {{validated-field
      label="Password"
      value=user.password
      errors=validator.password.errors}}
  `,

  // BEGIN-SNIPPET match-example-validator
  validator: computedValidator('user', {
    password: match(/^(?=.*[a-z])(?=.*[A-Z]).+$/)
      .message("must have at least one uppercase and one lowercase letter")
  })
  // END-SNIPPET
});

