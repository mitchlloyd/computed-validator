import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  negate,
  integer
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
      errors=(join validator.name.errors)}}
  `,

  // BEGIN-SNIPPET negate-example-validator
  validator: computedValidator('user', {
    name: negate(integer(), { message: "No integers please" })
  })
  // END-SNIPPET
});
