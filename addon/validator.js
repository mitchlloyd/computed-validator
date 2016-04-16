import {
  SUBJECT_KEY,
  TRANSLATE_KEY,
  CONTEXT_KEY,
  CACHE_KEY
} from 'computed-validator/validator/private-keys';
import { OWNER_KEY } from 'computed-validator/integrations/ember/validator';
import lookupTranslate from 'computed-validator/integrations/ember/lookup-translate';
import ValidationState, { nextValidationState } from 'computed-validator/validation-state';
import { every, some } from 'computed-validator/utils';
import Ember from 'ember';
const { RSVP } = Ember;

/**
 * Given a set of validation rules, this function creates a Validator class.
 *
 * @public
 * @param {Object} rules - A set of key-value pairs where the key is the name
 * of a validation property and the value is a validation blueprint.
 * @return {Class} Validator - A Validator class
 */
export function defineValidator(rules) {
  let Validator = function({ subject, owner, context }) {
    this[SUBJECT_KEY] = subject;
    this[OWNER_KEY] = owner;
    this[CONTEXT_KEY] = context;
    this[TRANSLATE_KEY] = lookupTranslate(owner);
    this[CACHE_KEY] = {};
  };

  Validator.ruleKeys = [];
  Validator.dependentKeys = [];

  for (let ruleKey in rules) {
    let { validate, dependentKeys } = rules[ruleKey](ruleKey);

    Object.defineProperty(Validator.prototype, ruleKey, {
      get: validateToGetter(validate, ruleKey),
      configurable: true,
      enumerable: true
    });
    Validator.ruleKeys.push(ruleKey);
    Validator.dependentKeys.push(...dependentKeys);
  }

  Object.defineProperty(Validator.prototype, 'isValid', {
    get: function() {
      return every(this.constructor.ruleKeys, (key) => {
        return this[key].isValid;
      });
    }
  });

  Object.defineProperty(Validator.prototype, 'isValidating', {
    get: function() {
      return some(this.constructor.ruleKeys, (key) => {
        return this[key].isValidating;
      });
    }
  });

  return Validator;
}

function validateToGetter(validate, ruleKey) {
  return function validationRuleGetterInterface() {
    let cachedState = this[CACHE_KEY][ruleKey];
    if (cachedState) {
      return cachedState;
    }

    let state = new ValidationState({
      errors: validate(this[SUBJECT_KEY]),
      translate: this[TRANSLATE_KEY],
      key: ruleKey
    });

    cacheValidationState(this, state);

    return state;
  };
}

/**
 * Given a subject and set of validation rules, create an instance of a
 * Validator.  This function is primarily used for testing or creating a
 * Validator instance based on a dynamic set of rules.
 *
 * @public
 * @param {Object} subject - The object to validate
 * @param {Object} rules -  A set of key-value pairs where the key is the name
 * of a validation property and the value is a validation blueprint.
 * @return {validator} An instance of Validator
 */
export function createValidator(subject, rules) {
  let Validator = defineValidator(rules);
  return new Validator({ subject });
}

function cacheValidationState(validator, state) {
  validator[CACHE_KEY][state.key] = state;
}

export function nextValidator(validator) {
  let nextValidationStates = validator.constructor.ruleKeys.map((ruleKey) => {
    return nextValidationState(validator[ruleKey]);
  });

  return RSVP.race(nextValidationStates).then((validationState) => {
    let nextValidator = new validator.constructor({
      subject: validator[SUBJECT_KEY],
      owner: validator[OWNER_KEY],
      context: validator[CONTEXT_KEY],
      translate: validator[TRANSLATE_KEY]
    });

    cacheValidationState(nextValidator, validationState);

    return nextValidator;
  });
}
