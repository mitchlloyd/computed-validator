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
      value=user.password}}

    {{#if validator.password.isValidating}}
      <p>Hang on talking to server...</p>
    {{/if}}

    <ul>
      {{#each validator.password.errors as |error|}}
        <li>{{error}}</li>
      {{/each}}
    </ul>

    {{validated-field
      label="Age"
      value=user.age}}

    <ul>
      {{#each validator.age.errors as |error|}}
        <li>{{error}}</li>
      {{/each}}
    </ul>

    {{#if validator.age.isValidating}}
      <p>Hang on talking to server...</p>
    {{/if}}

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
