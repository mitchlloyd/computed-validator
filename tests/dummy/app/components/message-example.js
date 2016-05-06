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

  translate() {
    return "translated message!";
  },

  // BEGIN-SNIPPET message-function-example
  validator: computedValidator('user', {
    name: required().message(component => component.translate("please translate"))
  })
  // END-SNIPPET
});

