import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  all,
  required,
  integer,
  between
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
      errors=(join validator.age.errors)}}
  `,

  // BEGIN-SNIPPET all-example-validator
  validator: computedValidator('user', {
    age: all(required(), integer(), between(21, 100))
  })
  // END-SNIPPET
});
