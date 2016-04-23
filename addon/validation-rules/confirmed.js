// BEGIN-SNIPPET confirmed-validation-rule
import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
import ValidationError from 'computed-validator/validation-error';
const { get } = Ember;

/**
 * A validation rule that returns an error if the value of a property
 * does not match the property associated with `keyToMatch`.
 *
 * @module
 * @public
 * @param {string} keyToMatch - Key pointing to a property that must match the
 * property identified by the validation key
 * @return {object} validationBlueprint
 */
export default validationRule(function([keyToMatch], { onProperty }) {
  let error = new ValidationError('validations.confirmed', { onProperty, keyToMatch });

  return {
    dependentKeys: [onProperty],
    validate(subject) {
      if (get(subject, onProperty) !== get(subject, keyToMatch)) {
        return error;
      }
    }
  };
});
// END-SNIPPET
