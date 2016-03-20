import Ember from 'ember';
import { every, some, unique } from 'computed-validator/utils';
import ValidationState from 'computed-validator/validation-state';
import defaultTranslator from 'computed-validator/translators/default';
import emberI18nTranslator from 'computed-validator/translators/ember-i18n';
import { firstResult } from 'computed-validator/utils';
import { nextValidationState } from 'computed-validator/validation-state';
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
    properties[ruleKey] = computedValidation(unique(dependentKeys), validate, ruleKey);
    dependentKeysForIsValid.push(ruleKey);
  }

  properties.isValid = computed(...dependentKeysForIsValid, function() {
    return every(dependentKeysForIsValid, (dk) => {
      return this.get(dk).isValid;
    });
  });

  properties.isValidating = computed(...dependentKeysForIsValid, function() {
    return some(dependentKeysForIsValid, (dk) => {
      return this.get(dk).isValidating;
    });
  })

  return Validator.extend(properties, {
    init() {
      this._super(...arguments);
      this[TRANSLATE_KEY] = lookupTranslateFunction(this[OWNER_KEY]);
      this.pendingPromiseCount = 0;
    }
  });
}

export function createValidator(subject, rules) {
  return defineValidator(rules).create({ [SUBJECT_KEY]: subject });
}

function computedValidation(dependentKeys, validate, ruleKey) {
  let subjectDependentKeys = dependentKeys.map((key) => `${SUBJECT_KEY}.${key}`);

  // Executed in the context of the validator.
  return computed(...subjectDependentKeys, {
    get() {
      let translate = get(this, TRANSLATE_KEY);
      let errors = validate.call(this, get(this, SUBJECT_KEY));
      let state = new ValidationState(errors, translate);

      if (state.isValidating) {
        nextValidationState(state).then((nextState) => {
          this.set(ruleKey, nextState);
        });
      }

      return state;
    },

    set(key, newState) {
      return newState;
    }
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
