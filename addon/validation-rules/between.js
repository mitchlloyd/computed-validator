import Ember from 'ember';
import validate from 'computed-validator/validate';
import validationRule from 'computed-validator/validation-rule';
import ValidationError from 'computed-validator/validation-error';
import { messageOption } from 'computed-validator/utils';
const { get } = Ember;

export default validationRule(function([min, max, options = {}], key) {
  let errorId;
  if (min === -Infinity) {
    errorId = 'validations.between.max-only'
  } else if (max === Infinity) {
    errorId = 'validations.between.min-only';
  } else {
    errorId = 'validations.between';
  }

  let error = new ValidationError(errorId, { min, max });

  return validate(key, function(subject) {
    let value = get(subject, key);
    let numericValue = +value;
    let isNotNumber = (numericValue != value) // jshint ignore:line

    if (isNotNumber) {
      numericValue = options.fallbackValue;
    }

    if (numericValue === undefined || numericValue > max || numericValue < min) {
      return error
    }
  });
})
