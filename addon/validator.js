import Ember from 'ember';
import { every } from 'computed-validator/utils';
import ValidationState from 'computed-validator/validation-state';
import defaultTranslator from 'computed-validator/translators/default';
import emberI18nTranslator from 'computed-validator/translators/ember-i18n';
import { firstResult } from 'computed-validator/utils';
const { computed, get } = Ember;
const Validator = Ember.Object.extend();
const translators = [emberI18nTranslator, defaultTranslator]

export const SUBJECT_KEY = '_computed-validator-subject';
export const OWNER_KEY = '_computed-validator-owner';
export const TRANSLATE_KEY = '_computed-validator-translate';

export default function defineValidator(rules) {
  let properties = {};
  let dependentKeysForIsValid = [];

  for (let ruleKey in rules) {
    let { dependentKeys, validate } = rules[ruleKey](ruleKey);
    properties[ruleKey] = computedValidation(dependentKeys, validate);
    dependentKeysForIsValid.push(ruleKey);
  }

  properties.isValid = computed(...dependentKeysForIsValid, function() {
    let validator = this;

    return every(dependentKeysForIsValid, function(dk) {
      return validator.get(dk).isValid;
    });
  });

  return Validator.extend(properties, {
    init() {
      this._super(...arguments);
      this[TRANSLATE_KEY] = lookupTranslateFunction(this[OWNER_KEY]);
    }
  });
}

export function createValidator(subject, rules) {
  return defineValidator(rules).create({ [SUBJECT_KEY]: subject });
}

// Executed in the context of the validator.
function computedValidation(dependentKeys, validate) {
  let subjectDependentKeys = dependentKeys.map((key) => `${SUBJECT_KEY}.${key}`);

  return computed(...subjectDependentKeys, function() {
    let errors = validate.call(this, {
      subject: get(this, SUBJECT_KEY),
      translate: get(this, TRANSLATE_KEY)
    });
    return new ValidationState(errors);
  });
}

// There are three ways to get a translate function:
//
// 1. If there is no owner, we'll use the default translator.
// 2. We'll look for a user-defined service and use the `translate` method.
// 3. Finally we'll loop through all magic translator adapters to get a translate
//    function given the owner.
//
function lookupTranslateFunction(owner) {
  // No owner, do the best we can
  if (!owner) {
    return defaultTranslator();
  }

  let customUserService = owner.lookup('service:computed-validator-translation');

  if (customUserService) {
    return customUserService.translate.bind(service);
  } else {
    return firstResult(translators, (translator) => translator(owner));
  }
}
