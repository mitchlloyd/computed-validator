import ValidationState, { nextValidationState } from 'computed-validator/validation-state';
import defaultTranslator from 'computed-validator/translators/default';
import { every, some } from 'computed-validator/utils';
import defineMemoizedGetter from 'computed-validator/utils/define-memoized-getter';
import { cacheValue } from 'computed-validator/utils/cache';
import Ember from 'ember';
const { RSVP, computed } = Ember;

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
  };

  Validator.ruleKeys = [];

  for (let ruleKey in rules) {
    /* jshint loopfunc: true */

    let { validate, dependentKeys } = rules[ruleKey].onProperty(ruleKey).build();
    let subjectDependentKeys = dependentKeys.map(key => `${PRIVATE}.subject.${key}`);

    Validator.prototype[ruleKey] = computed(...subjectDependentKeys, function() {
      return new ValidationState({
        errors: validate.call(this[PRIVATE].context, this[PRIVATE].subject),
        translate: this[PRIVATE].translate,
      });
    });

    /* jshint loopfunc: false */

    Validator.ruleKeys.push(ruleKey);
  }

  Validator.prototype.isValid = computed(...Validator.ruleKeys, function() {
    return every(this.constructor.ruleKeys, (key) => {
      return this[key].isValid;
    });
  });

  Validator.prototype.isValidating = computed(...Validator.ruleKeys, function() {
    return some(this.constructor.ruleKeys, (key) => {
      return this[key].isValidating;
    });
  });

  Validator.prototype.errors = computed(...Validator.ruleKeys, function() {
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
