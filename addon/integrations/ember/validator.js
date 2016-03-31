import Ember from 'ember';
import { every, some, unique } from 'computed-validator/utils';
import ValidationState from 'computed-validator/validation-state';
import { nextValidationState } from 'computed-validator/validation-state';
import lookupTranslate from 'computed-validator/integrations/ember/lookup-translate';
import { SUBJECT_KEY, TRANSLATE_KEY, CONTEXT_KEY } from 'computed-validator/validator/private-keys';
const { computed, get } = Ember;
const Validator = Ember.Object.extend();

export const OWNER_KEY = '_computed-validator-owner';

/**
 * Module exporting functions that build validator objects.
 * @module validator
 */

/**
 * Given a set of validation rules, this function creates a Validator class.
 *
 * @public
 * @param {Object} rules - A set of key-value pairs where the key is the name
 * of a validation property and the value is a validation blueprint.
 * @return {Class} Validator - A Validator class
 */
export function defineValidator(rules) {
  let validationRules = {};
  let validationRuleKeys = [];

  for (let ruleKey in rules) {
    let validationBlueprint = rules[ruleKey](ruleKey);
    validationRules[ruleKey] = computedValidation(validationBlueprint);
    validationRuleKeys.push(ruleKey);
  }

  return Validator.extend(validationRules, {
    init() {
      this._super(...arguments);
      this[TRANSLATE_KEY] = lookupTranslate(this[OWNER_KEY]);
    },

    isValid: computed(...validationRuleKeys, function validatorComputedisValid() {
      return every(validationRuleKeys, (dk) => this.get(dk).isValid);
    }),

    isValidating: computed(...validationRuleKeys, function validatorIsValidating() {
      return some(validationRuleKeys, (dk) => this.get(dk).isValidating);
    })
  });
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
  return defineValidator(rules).create({ [SUBJECT_KEY]: subject });
}

/**
 * This function creates a computed property that returns a validation state for
 * a validation rule.
 *
 * @private
 * @param {Object} validationBlueprint - An object with the dependentKeys and validate
 * function needed to define a computed property.
 * @return {Ember.ComputedProperty} - An Ember ComputedProperty object
 */
function computedValidation({ dependentKeys, validate }) {
  let subjectDependentKeys = unique(dependentKeys).map((key) => `${SUBJECT_KEY}.${key}`);
  let pendingPromise;

  // Executed in the context of the validator.
  return computed(...subjectDependentKeys, {
    get(key) {
      let translate = get(this, TRANSLATE_KEY);
      let context = get(this, CONTEXT_KEY);
      let errors = validate.call(context, get(this, SUBJECT_KEY));
      let state = new ValidationState(errors, translate);

      if (state.isValidating) {
        let promise = nextValidationState(state).then((nextState) => {
          // Is there another pending promise?
          if (promise === pendingPromise) {
            this.set(key, nextState);
          }
        });

        pendingPromise = promise;
      } else {
        pendingPromise = null;
      }

      return state;
    },

    set(key, newState) {
      return newState;
    }
  });
}
