import { flatMap } from 'computed-validator/utils';
import { metaBlueprintFor } from './utils';
import validationRule from 'computed-validator/validation-rule';

export default validationRule(function(validationRules, key) {
  let { dependentKeys, validateFunctions } = metaBlueprintFor(validationRules, key);

  let validate = function(subject) {
    return flatMap(validateFunctions, (fn) => fn(subject));
  };

  return { dependentKeys, validate };
})
