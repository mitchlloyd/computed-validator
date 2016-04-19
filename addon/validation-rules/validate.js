import validationRule from 'computed-validator/validation-rule';
import validate from 'computed-validator/validate';

/**
 * A flexible validation rule that uses a function to validate
 * values on the subject.
 *
 * @module
 * @public
 * @param {...string} dependentKeys - Dependent keys to determine when to rerun
 * the validation.  property identified by the validation key
 * @param {function} validate - A function that returns a validation error when
 * the property is not valid.
 * @return {object} validationBlueprint
 */
export default validationRule(function(args, key) {
  let [dependentKeys, fn] = normalizeArguments(args, key);
  return validate(...dependentKeys, fn);
});

function normalizeArguments(args, defaultKey) {
  let validate = args.pop();

  // Allow users to provide no key to use the default key.
  let keys;
  if (args.length > 0) {
    keys = args;
  } else {
    keys = [defaultKey];
  }

  return [keys, validate];
}
