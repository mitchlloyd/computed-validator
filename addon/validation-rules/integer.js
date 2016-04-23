import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
import ValidationError from 'computed-validator/validation-error';
const { get } = Ember;

/**
 * Validate that a value is an integer.
 *
 * @module
 * @public
 * @return {object} validationBlueprint
 */
export default validationRule(function(args, { onProperty }) {
  let error = new ValidationError('validations.integer', { property: onProperty });

  return {
    dependentKeys: [onProperty],
    validate(subject) {
      let value = get(subject, onProperty);

      if (!value || !value.toString().trim().match(/^[+-]?\d+$/)) {
        return error;
      }
    }
  };
});
