import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  required,
  onProperty
} from 'computed-validator';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.user = {
      city: {}
    };
  },

  layout: hbs`
    {{validated-field
      label="City Name"
      value=user.city.name
      errors=(join validator.cityName.errors)}}
  `,

  // BEGIN-SNIPPET on-property-example-validator
  validator: computedValidator('user', {
    cityName: onProperty('city.name', required())
  })
  // END-SNIPPET
});
