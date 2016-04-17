import {
  SUBJECT_KEY,
  TRANSLATE_KEY,
  CONTEXT_KEY,
  ID_KEY
} from 'computed-validator/validator/private-keys';
import { OWNER_KEY } from 'computed-validator/integrations/ember/validator';
import lookupTranslate from 'computed-validator/integrations/ember/lookup-translate';
import ValidationState, { nextValidationState } from 'computed-validator/validation-state';
import { every, some } from 'computed-validator/utils';
import defineMemoizedGetter from 'computed-validator/utils/define-memoized-getter';
import { initCache, cacheValue } from 'computed-validator/utils/cache';
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
    initCache(this);
  };

  Validator.ruleKeys = [];
  Validator.dependentKeys = [];

  for (let ruleKey in rules) {
    let { validate, dependentKeys } = rules[ruleKey](ruleKey);

    /*jshint loopfunc: true */
    defineMemoizedGetter(Validator, ruleKey, dependentKeys, function() {
      return new ValidationState({
        errors: validate(this[SUBJECT_KEY]),
        translate: this[TRANSLATE_KEY],
        dependentKeys,
        key: ruleKey
      });
    });
    /*jshint loopfunc: false */

    Validator.ruleKeys.push(ruleKey);
    Validator.dependentKeys.push(...dependentKeys);
  }

  defineMemoizedGetter(Validator, 'isValid', [], function() {
    return every(this.constructor.ruleKeys, (key) => {
      return this[key].isValid;
    });
  });

  defineMemoizedGetter(Validator, 'isValidating', [], function() {
    return some(this.constructor.ruleKeys, (key) => {
      return this[key].isValidating;
    });
  });

  defineMemoizedGetter(Validator, 'errors', [], function() {
    let errors = [];
    this.constructor.ruleKeys.forEach((key) => {
      errors.push(...this[key].errors);
    });

    return errors;
  });

  return Validator;
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

export function nextValidator(validator) {
  let pendingValidationStates = [];

  validator.constructor.ruleKeys.forEach((ruleKey) => {
    let validationState = validator[ruleKey];
    if (validationState.isValidating) {
      pendingValidationStates.push(nextValidationState(validationState));
    }
  });

  return RSVP.race(pendingValidationStates).then(({ validationState, previousValidationState }) => {
    return { validationState, previousValidationState };
    // let nextValidator = new validator.constructor({
    //   subject: validator[SUBJECT_KEY],
    //   owner: validator[OWNER_KEY],
    //   context: validator[CONTEXT_KEY],
    //   translate: validator[TRANSLATE_KEY]
    // });

    // return nextValidator;
  });
}
