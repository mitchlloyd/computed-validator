import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
import ValidationError from 'computed-validator/validation-error';
const { get } = Ember;

/**
 * A validation rule that returns errors when a numeric value is not
 * between (inclusive) the given min and max values.
 *
 * @module
 * @public
 * @param {number} min
 * @param {number} max
 * @return {object} validationBlueprint
 */
export default validationRule(function([min, max], { onProperty, fallbackValue }) {
  let errorId;
  if (min === -Infinity) {
    errorId = 'validations.between.max-only';
  } else if (max === Infinity) {
    errorId = 'validations.between.min-only';
  } else {
    errorId = 'validations.between';
  }

  let error = new ValidationError(errorId, { min, max });

  return {
    dependentKeys: [onProperty],
    validate(subject) {
      let value = get(subject, onProperty);
      let numericValue = +value;
      let isNotNumber = (numericValue != value) // jshint ignore:line

      if (isNotNumber) {
        numericValue = fallbackValue;
      }

      if (numericValue === undefined || numericValue > max || numericValue < min) {
        return error;
      }
    }
  };
});
