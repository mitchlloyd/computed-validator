// BEGIN-SNIPPET quick-start-example
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  lengthInRange,
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
      errors=validator.name.errors}}

    {{validated-field
      label="Age"
      value=user.age
      errors=validator.age.errors}}

    <button
      class="btn btn-primary"
      disabled={{not validator.isValid}}>
      Submit
    </button>
  `,

  validator: computedValidator('user', {
    name: lengthInRange(2, Infinity),
    age: integer()
  })
});
// END-SNIPPET
