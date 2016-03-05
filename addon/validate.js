import Ember from 'ember'
import { SUBJECT_KEY } from 'computed-validator/validator';
const { get } = Ember;

export default function validate(...args) {
  return function(key) {
    let [subjectKeys, fn] = normalizeArguments(args, key);
    let validatorKeys = subjectKeys.map((key) => `${SUBJECT_KEY}.${key}`);

    return {
      dependentKeys: validatorKeys,
      fn: function() {
        return fn(get(this, SUBJECT_KEY), ...subjectKeys);
      }
    };
  };
}

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