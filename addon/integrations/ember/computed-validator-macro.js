import Ember from 'ember';
import { defineValidator } from 'computed-validator';
import { nextValidator } from 'computed-validator/validator';
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
  let pendingPromise;
  let dependentKeys = Validator.dependentKeys.map((k) => `${subjectKey}.${k}`);

  return computed(...dependentKeys, {
    get(key) {
      let subject = this.get(subjectKey);

      if (!subject) {
        return;
      }

      let validator = new Validator({
        subject: this.get(subjectKey),
        owner: getOwner(this),
        // TODO: Probably will not need this.
        context: this
      });

      if (validator.isValidating) {
        let promise = nextValidator(validator).then((validator) => {
          // Is there another pending promise?
          if (promise === pendingPromise) {
            this.set(key, validator);
          }
        });

        pendingPromise = promise;
      } else {
        pendingPromise = null;
      }

      return validator;
    },

    set(key, validator) {
      return validator;
    }
  });
}
