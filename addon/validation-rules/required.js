// BEGIN-SNIPPET required-validation-rule
import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
import ValidationError from 'computed-validator/validation-error';
const { get } = Ember;

/**
 * Validate that a property is present.
 *
 * @module
 * @public
 * @return {object} validationBuilder
 */
export default validationRule(function(args, { onProperty }) {
  let error = new ValidationError('validations.required', { property: onProperty });

  return {
    dependentKeys: [onProperty],
    validate(subject) {
      if (!get(subject, onProperty)) {
        return error;
      }
    }
  };
});
// END-SNIPPET
