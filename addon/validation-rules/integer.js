import Ember from 'ember';
import validate from 'computed-validator/validate';
import validationRule from 'computed-validator/validation-rule';
import ValidationError from 'computed-validator/validation-error';
const { get } = Ember;

export default validationRule(function(args, key) {
  let error = new ValidationError('validations.integer', { property: key });

  return validate(key, function(subject) {
    let value = get(subject, key);

    if (!value || !value.toString().trim().match(/^[+-]?\d+$/)) {
      return error;
    }
  });
});
