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
