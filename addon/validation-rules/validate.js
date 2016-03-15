import Ember from 'ember'
import { SUBJECT_KEY, TRANSLATE_KEY } from 'computed-validator/validator';
import validationRule from 'computed-validator/validation-rule';
import validate from 'computed-validator/validate';
const { get } = Ember;

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
