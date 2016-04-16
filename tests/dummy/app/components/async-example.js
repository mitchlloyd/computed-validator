// BEGIN-SNIPPET async-example
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  sequence,
  lengthBetween,
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
      value=user.password}}

    <ul>
      {{#each validator.errors as |error|}}
        <li>{{error}}</li>
      {{/each}}
    </ul>

    {{#if validator.isValidating}}
      <p>Hang on talking to server...</p>
    {{/if}}

    <button class="btn m-b-2" disabled={{validator.isValid}}>Submit</button>
  `,

  validator: computedValidator('user', {
    password: sequence(lengthBetween(4, Infinity), validate(function() {
      return new RSVP.Promise(function(resolve) {
        setTimeout(function() {
          resolve('must not have been used in the last three passwords');
        }, 1000);
      });
    }))
  })
});
// END-SNIPPET
