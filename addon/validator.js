import lookupTranslate from 'computed-validator/integrations/ember/lookup-translate';
import ValidationState, { nextValidationState } from 'computed-validator/validation-state';
import { every, some } from 'computed-validator/utils';
import defineMemoizedGetter from 'computed-validator/utils/define-memoized-getter';
import { initCache, cacheValue } from 'computed-validator/utils/cache';
import Ember from 'ember';
const { RSVP } = Ember;

const PRIVATE = '_computed-validator-private-properties';

/**
 * Given a set of validation rules, this function creates a Validator class.
 *
 * @public
 * @param {Object} rules - A set of key-value pairs where the key is the name
 * of a validation property and the value is a validation blueprint.
 * @return {Class} Validator - A Validator class
 */
export function defineValidator(rules) {
  let Validator = function({ subject, owner, context, ancestor }) {
    this[PRIVATE] = {
      subject,
      owner,
      context,
      translate: lookupTranslate(owner)
    };
    initCache(this, subject, ancestor);
  };

  Validator.ruleKeys = [];
  Validator.dependentKeys = [];

  for (let ruleKey in rules) {
    let { validate, dependentKeys } = rules[ruleKey](ruleKey);

    /*jshint loopfunc: true */
    defineMemoizedGetter(Validator.prototype, ruleKey, dependentKeys, function() {
      return new ValidationState({
        errors: validate(getPrivate(this, 'subject')),
        translate: getPrivate(this, 'translate'),
        dependentKeys,
        key: ruleKey
      });
    });
    /*jshint loopfunc: false */

    Validator.ruleKeys.push(ruleKey);
    Validator.dependentKeys.push(...dependentKeys);
  }

  defineMemoizedGetter(Validator.prototype, 'isValid', [], function() {
    return every(this.constructor.ruleKeys, (key) => {
      return this[key].isValid;
    });
  });

  defineMemoizedGetter(Validator.prototype, 'isValidating', [], function() {
    return some(this.constructor.ruleKeys, (key) => {
      return this[key].isValidating;
    });
  });

  defineMemoizedGetter(Validator.prototype, 'errors', [], function() {
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

let breaker = 0;

export function nextValidator(validator, getCurrentValidator, callback) {
  let pendingValidationStates = [];
  let Validator = validator.constructor;

  validator.constructor.ruleKeys.forEach((ruleKey) => {
    let validationState = validator[ruleKey];
    if (validationState.isValidating) {
      pendingValidationStates.push(nextValidationState(validationState));
    }
  });

  RSVP.race(pendingValidationStates).then(({ validationState, previousValidationState }) => {
    let currentValidator = getCurrentValidator();

    // If the previous validation state does not match the current one, then this update
    // is no longer relevant.
    if (currentValidator[validationState.key] !== previousValidationState) {
      return;
    }

    let privateProps = currentValidator[PRIVATE];
    let validator = new Validator({
      subject: privateProps.subject,
      ancestor: currentValidator,
      owner: privateProps.owner,
      context: privateProps.context
    });

    cacheValue(validator, validationState.key, validationState.dependentKeys, validationState);

    callback(validator);

    // Recursively call nextValidator until no longer validating.
    if (validator.isValidating) {
      breaker++;
      if (breaker > 200) {
        throw new Error("Infinite loop");
      }
      nextValidator(validator, getCurrentValidator, callback);
    }
  });
}

export function getPrivate(validator, key) {
  return validator[PRIVATE][key];
}
