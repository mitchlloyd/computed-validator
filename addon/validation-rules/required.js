// BEGIN-SNIPPET required-validation-rule
import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
import ValidationError from 'computed-validator/validation-error';
import validate from 'computed-validator/validate';
const { get } = Ember;

/**
 * Validate that a property is present.
 *
 * @module
 * @public
 * @return {object} validationBlueprint
 */
export default validationRule(function(_, key) {
  let error = new ValidationError('validations.required', { property: key });

  return validate(key, function(subject) {
    if (!get(subject, key)) {
      return error;
    }
  });
});
// END-SNIPPET
