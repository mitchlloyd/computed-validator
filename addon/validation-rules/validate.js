import Ember from 'ember'
import { SUBJECT_KEY, TRANSLATE_KEY } from 'computed-validator/validator';
import validationRule from 'computed-validator/validation-rule';
const { get } = Ember;

export default validationRule(function({ args, key }) {
  let [dependentKeys, validation] = normalizeArguments(args, key);
  let fn = function(...args) {
    return normalizeErrorsResult(validation(...args));
  }
  return { dependentKeys, fn };
});

function normalizeArguments(args, defaultKey) {
  let fn = args.pop();

  // There are 3 ways to pass dependent keys
  //
  // 1. Provide a function that returns the keys
  // 2. Provide a list of the keys
  // 3. Provide no key and take the default attribute dependent key
  let keys;
  if (typeof args[0] === 'function') {
    keys = args[0](defaultKey);
  } else if (args.length > 0) {
    keys = args;
  } else {
    keys = [defaultKey];
  }

  return [keys, fn];
}

function normalizeErrorsResult(errorOrErrors) {
  if (!errorOrErrors) {
    return [];
  } else if (typeof errorOrErrors === 'string' || errorOrErrors.string) {
    return [errorOrErrors];
  } else if (Array.isArray(errorOrErrors)) {
    return [errorOrErrors];
  } else {
    throw new Error(`invalid return value from validate: ${errorOrErrors}`);
  }
}
