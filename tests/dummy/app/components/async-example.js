// BEGIN-SNIPPET async-example
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  sequence,
  lengthInRange,
  validate
} from 'computed-validator';
const { RSVP } = Ember;

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.user = {};
  },

  layout: hbs`
    {{validated-field
      label="Password"
      value=user.password
      errors=(if validator.password.isValidating 'Wait a sec...' validator.password.errors)}}

    <button class="btn m-b-2" disabled={{validator.isValid}}>
      {{if validator.isValidating 'Checking...' 'Submit'}}
    </button>
  `,

  validator: computedValidator('user', {
    password: sequence(lengthInRange(4, Infinity), validate(function() {
      return new RSVP.Promise(function(resolve) {
        setTimeout(function() {
          resolve('has been used in last three passwords');
        }, 1000);
      });
    }))
  })
});
// END-SNIPPET
