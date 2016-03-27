import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  noMatch
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

  // BEGIN-SNIPPET no-match-example-validator
  validator: computedValidator('user', {
    password: noMatch(/^password$/, {
      message: "that's not a good password"
    })
  })
  // END-SNIPPET
});

