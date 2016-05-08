// BEGIN-SNIPPET async-parallel
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
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

    {{validated-field
      label="Age"
      value=user.age
      errors=(if validator.age.isValidating 'Wait a sec...' validator.age.errors)}}

    <button class="btn m-b-2" disabled={{validator.isValid}}>Submit</button>
  `,

  validator: computedValidator('user', {
    password: validate(function() {
      return new RSVP.Promise(function(resolve) {
        setTimeout(function() {
          resolve('some password error');
        }, 1000);
      });
    }),

    age: validate(function() {
      return new RSVP.Promise(function(resolve) {
        setTimeout(function() {
          resolve('some age error');
        }, 1000);
      });
    })
  })
});
// END-SNIPPET
