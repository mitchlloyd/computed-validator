import validationRule from 'computed-validator/validation-rule';

/**
 * A validation rule that inverts the validity of another rule.
 *
 * This rule uses another's validate function to create a new, negated rule.
 * When the original rule would have returned errors the new rule returns none.
 * When the original rule returns no errors the new rule returns an error.
 *
 * This rule does not currently support negating asynchronous validation rules,
 * but it should be pretty simple to add if someone finds it useful.
 *
 * For practical use, you'll want to provide a message option to this rule
 * so that it can display a reasonable error message.
 *
 * @public
 * @module
 * @param {function} validationRule - A validation rule to be negated
 * @return {object} validationBlueprint
 */
export default validationRule(function([rule], options) {
  let { dependentKeys, validate } = rule.assign(options).build();

  let negatedValidate = function(subject) {
    let errors = validate(subject);
    if (errors.length) {
      return [];
    } else {
      return ["should be opposite"];
    }
  };

  return {
    dependentKeys,
    validate: negatedValidate
  };
});
