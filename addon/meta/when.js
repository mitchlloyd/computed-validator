import validationRule from 'computed-validator/validation-rule';

/**
 * This rule executes another rule only when a given key is a truthy value on
 * the subject. This rule duplicates the functionality of the "when" option
 * and may be removed.
 */
export default validationRule(function([whenKey, rule], { onProperty }) {
  return rule.assign({ onProperty, when: whenKey }).build();
});
