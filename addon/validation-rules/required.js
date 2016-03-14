import Ember from 'ember';
import { validate } from 'computed-validator';
import validationRule from 'computed-validator/validation-rule';
import ValidationError from 'computed-validator/validation-error';
const { get } = Ember;

export default validationRule(function({ args: { message }, key }) {
  let error = message || new ValidationError('validations.required', { property: key });

  return {
    dependentKeys: [key],

    validate(subject) {
      if (!get(subject, key)) {
        return [error];
      } else {
        return [];
      }
    }
  };
})
