// BEGIN-SNIPPET confirmed-validation-rule
import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
import validate from 'computed-validator/validate';
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
export default validationRule(function([keyToMatch], key) {
  let error = new ValidationError('validations.confirmed', { key, keyToMatch });

  return validate(key, keyToMatch, function(subject) {
    if (get(subject, key) !== get(subject, keyToMatch)) {
      return error;
    }
  });
})
// END-SNIPPET
