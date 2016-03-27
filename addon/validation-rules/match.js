import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
import ValidationError from 'computed-validator/validation-error';
import validate from 'computed-validator/validate';
const { get } = Ember;

/**
 * Validate that a value matches a regular expression.
 *
 * @module
 * @public
 * @param {string} regex - Regular expression to match
 * @return {object} validationBlueprint
 */
export default validationRule(function([regex], key) {
  let error = new ValidationError('validations.match', { property: key, regex });

  return validate(key, function(subject) {
    let value = get(subject, key);

    if (!regex.test(value)) {
      return error
    }
  });
})
