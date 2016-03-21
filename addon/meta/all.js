import { flatMap } from 'computed-validator/utils';
import { metaBlueprintFor } from './utils';
import validationRule from 'computed-validator/validation-rule';

/**
 * A validation rule that synthesizes a combined validation rule from others.
 *
 * This rule examines the dependent keys and validate functions for other rules
 * to build a rule that returns errors derived from running all of the functions.
 *
 * @param {array} validationRules - A list of validation rules declared by the user
 * @return {object} validationBlueprint
 */
export default validationRule(function(validationRules, key) {
  let { dependentKeys, validateFunctions } = metaBlueprintFor(validationRules, key);

  let validate = function(subject) {
    return flatMap(validateFunctions, (fn) => fn(subject));
  };

  return { dependentKeys, validate };
})
