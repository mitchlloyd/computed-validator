import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  lengthBetween
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

  // BEGIN-SNIPPET length-between-example-validator
  validator: computedValidator('user', {
    name: lengthBetween(0, 5)
  })
  // END-SNIPPET
});
