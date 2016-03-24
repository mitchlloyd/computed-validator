import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  required
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

  // BEGIN-SNIPPET required-example-validator
  validator: computedValidator('user', {
    name: required()
  })
  // END-SNIPPET
});

