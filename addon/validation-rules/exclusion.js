import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
import ValidationError from 'computed-validator/validation-error';
const { get } = Ember;

/**
 * Validate that a value is not in an array of forbidden values.
 *
 * @module
 * @public
 * @param {string[]} forbiddenValues - list of forbidden values
 * @return {object} validationBuilder
 */
export default validationRule(function(forbiddenValues, { onProperty }) {
  let error = new ValidationError('validations.exclusion', { forbiddenValues });

  return {
    dependentKeys: [onProperty],
    validate(subject) {
      let value = get(subject, onProperty);

      if (forbiddenValues.indexOf(value) !== -1) {
        return error;
      }
    }
  };
});
