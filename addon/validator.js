import Ember from 'ember';
import { every, wrap } from 'computed-validator/utils';
const { computed, get } = Ember;
const Validator = Ember.Object.extend();

export const SUBJECT_KEY = '_computed-validator-subject';

export default function defineValidator(rules) {
  let properties = {};
  let dependentKeysForIsValid = [];

  for (let ruleKey in rules) {
    let { dependentKeys, fn } = rules[ruleKey](ruleKey);
    properties[ruleKey] = computed(...dependentKeys, wrap(fn, validationResult));
    dependentKeysForIsValid.push(ruleKey);
  }

  properties.isValid = computed(...dependentKeysForIsValid, function() {
    let validator = this;

    return every(dependentKeysForIsValid, function(dk) {
      return validator.get(dk).isValid;
    });
  });

  return Validator.extend(properties);
}

export function createValidator(subject, rules) {
  return defineValidator(rules).create({ [SUBJECT_KEY]: subject });
}

export function validationResult(incomingErrors) {
  let errors;

  // Transform single string errors into an array.
  if (typeof incomingErrors === 'string') {
    errors = [incomingErrors];
  } else if (!incomingErrors) {
    errors = [];
  } else {
    errors = incomingErrors;
  }

  if (errors.length) {
    return {
      isValid: false,
      errors: errors
    };
  } else {
    return {
      isValid: true,
      errors: []
    };
  }
}
