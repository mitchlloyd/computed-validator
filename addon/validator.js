import ValidationState from 'computed-validator/validation-state';
import defaultTranslator from 'computed-validator/translators/default';
import { every, some } from 'computed-validator/utils';
import Ember from 'ember';
const { computed, get, set, cacheFor } = Ember;

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
  let ruleKeys = Object.keys(rules);
  let ruleMethods = {};

  ruleKeys.forEach(function(ruleKey) {
    let { validate, dependentKeys } = rules[ruleKey].onProperty(ruleKey).build();
    let subjectDependentKeys = dependentKeys.map(key => `${PRIVATE}.subject.${key}`);

    ruleMethods[ruleKey] = computed(...subjectDependentKeys, {
      get() {
        return new ValidationState({
          errors: validate.call(this[PRIVATE].context, this[PRIVATE].subject),
          translate: this[PRIVATE].translate,
          onUpdate: nextState => {
            if (nextState.isUpdateOf(cacheFor(this, ruleKey))) {
              set(this, ruleKey, nextState);
            }
          }
        });
      },

      set(key, value) {
        return value;
      }
    });
  });

  const Validator = Ember.Object.extend(ruleMethods, {
    init() {
      this._super();
      this[PRIVATE] = {
        subject: this.subject,
        context: this.context,
        translate: this.translate || defaultTranslator()
      };
    },

    isValid: computed(...ruleKeys, function() {
      return every(ruleKeys, (key) => {
        return get(this, `${key}.isValid`);
      });
    }),

    isValidating: computed(...ruleKeys, function() {
      return some(ruleKeys, (key) => {
        return get(this, `${key}.isValidating`);
      });
    }),

    errors: computed(...ruleKeys, function() {
      let errors = [];
      ruleKeys.forEach((key) => {
        errors.push(...get(this, `${key}.errors`));
      });

      return errors;
    })
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
