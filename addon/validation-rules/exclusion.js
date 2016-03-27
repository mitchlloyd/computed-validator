import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
import validate from 'computed-validator/validate';
import ValidationError from 'computed-validator/validation-error';
const { get } = Ember;

/**
 * Validate that a value is not in an array of forbidden values.
 *
 * @module
 * @public
 * @param {string[]} forbiddenValues - list of forbidden values
 * @return {object} validationBlueprint
 */
export default validationRule(function(forbiddenValues, key) {
  let error = new ValidationError('validations.exclusion', { forbiddenValues });

  return validate(key, function(subject) {
    let value = get(subject, key);

    if (forbiddenValues.indexOf(value) !== -1) {
      let values = forbiddenValues.join(', ');
      return error;
    }
  });
});
