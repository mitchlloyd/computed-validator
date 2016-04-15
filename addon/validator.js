import { SUBJECT_KEY, TRANSLATE_KEY, CONTEXT_KEY } from 'computed-validator/validator/private-keys';
import { OWNER_KEY } from 'computed-validator/integrations/ember/validator';
import lookupTranslate from 'computed-validator/integrations/ember/lookup-translate';
import ValidationState from 'computed-validator/validation-state';

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
  };

  Validator.ruleKeys = [];

  for (let ruleKey in rules) {
    let validationBlueprint = rules[ruleKey](ruleKey);

    Object.defineProperty(Validator.prototype, ruleKey, {
      get: validateToGetter(validationBlueprint.validate)
    });
    Validator.ruleKeys.push(ruleKey);
  }

  Object.defineProperty(Validator.prototype, 'isValid', {
    get: function() {
      return false;
    }
  });

  Object.defineProperty(Validator.prototype, 'isValidating', {
    isValidating: function() {
      return false;
    }
  });

  return Validator;
}

function validateToGetter(validate) {
  return function validationRuleGetterInterface() {
    // TODO: wrap validate with custom memoization
    let errors = validate(this[SUBJECT_KEY]);
    return new ValidationState(errors, this[TRANSLATE_KEY]);
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
