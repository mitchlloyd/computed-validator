import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  required
} from 'computed-validator';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.user = {
      city: {}
    };
  },

  layout: hbs`
    <label class="m-r-1">
      <input
        type="checkbox"
        onchange={{action (mut user.isInCity) value="currentTarget.checked"}} />
      I live in a city!
    </label>

    {{validated-field
      label="City Name"
      value=user.city.name
      errors=(join validator.cityName.errors)}}
  `,

  // BEGIN-SNIPPET options-builder-example-validator
  validator: computedValidator('user', {
    cityName: required()
      .onProperty('city.name')
      .when('isInCity')
      .message('What city do you live in?')
  })
  // END-SNIPPET
});
