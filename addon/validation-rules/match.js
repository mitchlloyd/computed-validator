import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
import ValidationError from 'computed-validator/validation-error';
const { get } = Ember;

/**
 * Validate that a value matches a regular expression.
 *
 * @module
 * @public
 * @param {string} regex - Regular expression to match
 * @return {object} validationBuilder
 */
export default validationRule(function([regex], { onProperty }) {
  let error = new ValidationError('validations.match', { property: onProperty, regex });

  return {
    dependentKeys: [onProperty],
    validate(subject) {
      let value = get(subject, onProperty);

      if (!regex.test(value)) {
        return error;
      }
    }
  };
});
