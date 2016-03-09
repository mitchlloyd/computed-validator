import Ember from 'ember';
import { every } from 'computed-validator/utils';
import ValidationState from 'computed-validator/validation-state';
const { computed, get } = Ember;
const Validator = Ember.Object.extend();

export const SUBJECT_KEY = '_computed-validator-subject';

export default function defineValidator(rules) {
  let properties = {};
  let dependentKeysForIsValid = [];

  for (let ruleKey in rules) {
    let { dependentKeys, fn } = rules[ruleKey](ruleKey);
    properties[ruleKey] = computedValidation(dependentKeys, fn);
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

// Executed in the context of the validator.
function computedValidation(dependentKeys, fn) {
  return computed(...dependentKeys, function() {
    return new ValidationState(fn.apply(this));
  });
}

