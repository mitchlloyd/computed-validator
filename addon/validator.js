import Ember from 'ember';
import { every } from 'computed-validator/utils';
const { computed } = Ember;
const Validator = Ember.Object.extend();
export const SUBJECT_KEY = '_computed-validator-subject';

export default function defineValidator(rules) {
  let properties = {};
  let isValidDependentKeys = [];

  for (let ruleKey in rules) {
    let { dependentKeys, fn } = rules[ruleKey](ruleKey);
    properties[ruleKey] = computed(...dependentKeys, fn);

    isValidDependentKeys.push(ruleKey);
  }

  properties.isValid = computed(...isValidDependentKeys, function() {
    let validator = this;

    return every(isValidDependentKeys, function(dk) {
      return validator.get(dk).isValid;
    });
  });

  return Validator.extend(properties);
}

export function createValidator(subject, rules) {
  return defineValidator(rules).create({ [SUBJECT_KEY]: subject });
}

export function validate(...params) {
  return function(key) {
    let fn = params.pop();

    // There are 3 ways to pass dependent keys
    //
    // 1. Provide a function that returns the keys
    // 2. Provide a list of the keys
    // 3. Provide no key and take the default attribute dependent key
    let dependentKeyParams;
    if (typeof params[0] === 'function') {
      dependentKeyParams = params[0](key);
    } else if (params.length > 0) {
      dependentKeyParams = params;
    } else {
      dependentKeyParams = [key];
    }

    let dependentKeys = dependentKeyParams.map((key) => `${SUBJECT_KEY}.${key}`);

    // Returning a blueprint for a CP to allow composing without using cp._dependentKeys
    return {
      dependentKeys,
      fn: function() {
        return validationResult(fn(this.get(SUBJECT_KEY), ...dependentKeyParams));
      }
    };
  };
}

function validationResult(ruleResult) {
  if (ruleResult) {
    return {
      isValid: false,
      errors: [ruleResult]
    };
  } else {
    return {
      isValid: true,
      errors: []
    };
  }
}
