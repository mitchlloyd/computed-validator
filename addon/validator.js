import ValidationState, { nextValidationState } from 'computed-validator/validation-state';
import defaultTranslator from 'computed-validator/translators/default';
import { every, some } from 'computed-validator/utils';
import defineMemoizedGetter from 'computed-validator/utils/define-memoized-getter';
import { initCache, cacheValue } from 'computed-validator/utils/cache';
import Ember from 'ember';
const { RSVP } = Ember;

const PRIVATE = '_computed-validator-private';

/**
 * Given a set of validation rules, this function creates a Validator class.
 *
 * @public
 * @param {Object} rules - A set of key-value pairs where the key is the name
 * of a validation property and the value is a validation blueprint.
 * @return {Class} Validator - A Validator class
 */
export function defineValidator(rules) {
  let Validator = function({ subject, context, ancestor, translate }) {
    this[PRIVATE] = { subject, context, translate: translate || defaultTranslator() };
    initCache(this, subject, ancestor, this.constructor.validationRuleDependentKeys);
  };

  Validator.ruleKeys = [];
  Validator.dependentKeys = [];
  Validator.validationRuleDependentKeys = {};

  for (let ruleKey in rules) {
    let { validate, dependentKeys } = rules[ruleKey](ruleKey);

    Validator.validationRuleDependentKeys[ruleKey] = dependentKeys;

    /*jshint loopfunc: true */
    defineMemoizedGetter(Validator.prototype, ruleKey, function() {
      return new ValidationState({
        errors: validate.call(this[PRIVATE].context, this[PRIVATE].subject),
        translate: this[PRIVATE].translate,
      });
    });
    /*jshint loopfunc: false */

    Validator.ruleKeys.push(ruleKey);
    Validator.dependentKeys.push(...dependentKeys);
  }

  defineMemoizedGetter(Validator.prototype, 'isValid', function() {
    return every(this.constructor.ruleKeys, (key) => {
      return this[key].isValid;
    });
  });

  defineMemoizedGetter(Validator.prototype, 'isValidating', function() {
    return some(this.constructor.ruleKeys, (key) => {
      return this[key].isValidating;
    });
  });

  defineMemoizedGetter(Validator.prototype, 'errors', function() {
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

export function nextValidator(validator, getCurrentValidator, callback) {
  let pendingValidationStates = [];
  let Validator = validator.constructor;

  validator.constructor.ruleKeys.forEach((ruleKey) => {
    let validationState = validator[ruleKey];
    if (validationState.isValidating) {
      pendingValidationStates.push(nextValidationState({ ruleKey, validationState }));
    }
  });

  RSVP.race(pendingValidationStates).then(({ validationState, previousValidationState, ruleKey }) => {
    let currentValidator = getCurrentValidator();

    // If the previous validation state does not match the current one, then this update
    // is no longer relevant.
    if (currentValidator[ruleKey] !== previousValidationState) {
      return;
    }

    let privateProps = currentValidator[PRIVATE];
    let validator = new Validator({
      subject: privateProps.subject,
      ancestor: currentValidator,
      translate: privateProps.translate,
      context: privateProps.context
    });

    cacheValue(validator, ruleKey, validationState);

    callback(validator);

    // Recursively call nextValidator until no longer validating.
    if (validator.isValidating) {
      nextValidator(validator, getCurrentValidator, callback);
    }
  });
}
