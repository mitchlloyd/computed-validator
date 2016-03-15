import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
import ValidationError from 'computed-validator/validation-error';
import validate from 'computed-validator/validate';
const { get } = Ember;

export default validationRule(function({ args: { message }, key }) {
  let error = message || new ValidationError('validations.required', { property: key });

  return validate(key, function(subject) {
    if (!get(subject, key)) {
      return error;
    }
  });
})
