import { CACHE_KEY, SUBJECT_KEY } from 'computed-validator/validator/private-keys';
import { every } from 'computed-validator/utils';
import Ember from 'ember';
import { defineValidator } from 'computed-validator';
import { nextValidator } from 'computed-validator/validator';
import { transferCache, cacheValue } from 'computed-validator/utils/cache';
const { computed, getOwner } = Ember;

/**
 * This is the primary interface for using Computed Validator. When used from an
 * Ember "looked up" object, it given Computed Validator a chance to access the
 * container so that it can integrate with translation services.
 *
 * @public
 * @param {string} subjectKey - A key used to find the subject on the context
 * @param {object} rules - A set of key-value pairs that are used to define a
 * validator class
 * @module
 */
export default function(subjectKey, rules) {
  let Validator = defineValidator(rules);
  let dependentKeys = Validator.dependentKeys.map((k) => `${subjectKey}.${k}`);
  let validator;

  return computed(...dependentKeys, {
    get(key) {
      let subject = this.get(subjectKey);

      if (!subject) {
        return;
      }

      let nextValidator = validatorForEmberObject(this, Validator, subjectKey);
      transferCache(validator, nextValidator);
      validator = nextValidator;

      resolvePendingValidations(validator, ({ validationState, previousValidationState }) => {
        if (validationUpdateIsStillRelevant(validator, validationState, previousValidationState)) {
          let nextValidator = validatorForEmberObject(this, Validator, subjectKey);
          transferCache(validator, nextValidator);
          validator = nextValidator;

          cacheValue(validator, validationState.key, validationState.dependentKeys, validationState);
          this.set(key, validator);
          return validator;
        }
      });

      return validator;
    },

    set(key, validator) {
      return validator;
    }
  });
}

function validationUpdateIsStillRelevant(validator, validationState, previousValidationState) {
  return validator[validationState.key] === previousValidationState;
}

function validatorForEmberObject(obj, Validator, subjectKey) {
  return new Validator({
    subject: obj.get(subjectKey),
    owner: getOwner(obj),
    context: obj
  });
}

let breaker = 0;
function resolvePendingValidations(validator, fn) {
  breaker++;

  if (breaker > 200) {
    console.log('infiniteloop');
    return;
  }

  if (!validator) {
    return;
  }

  if (validator.isValidating) {
    nextValidator(validator).then((args) => {
      resolvePendingValidations(fn(args), fn);
    });
  }
}
