import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  exclusion
} from 'computed-validator';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.user = {};
  },

  layout: hbs`
    {{validated-field
      label="Username ('admin' not allowed)"
      value=user.username
      errors=validator.username.errors}}
  `,

  // BEGIN-SNIPPET exclusion-example-validator
  validator: computedValidator('user', {
    username: exclusion('admin')
  })
  // END-SNIPPET
});
