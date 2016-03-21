import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
const { get } = Ember;

/**
 * This rule executes another rule only when a given key is a truthy value on
 * the subject. This rule duplicates the functionality of the "when" option
 * and may be removed.
 */
export default validationRule(function([whenKey, rule], key) {
  let { dependentKeys, validate } = rule(key);

  let wrappedValidate = function(subject) {
    if (get(subject, whenKey)) {
      return validate(subject);
    } else {
      return [];
    }
  };

  return {
    dependentKeys: dependentKeys.concat(whenKey),
    validate: wrappedValidate
  };
});
