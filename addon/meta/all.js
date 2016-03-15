import { SUBJECT_KEY, TRANSLATE_KEY } from 'computed-validator/validator';
import { flatMap } from 'computed-validator/utils';
import { metaBlueprintFor } from './utils';
import validationRule from 'computed-validator/validation-rule';

export default validationRule(function(validationRules, key) {
  let { dependentKeys, validateFunctions } = metaBlueprintFor(validationRules, key);

  let validate = function() {
    return flatMap(validateFunctions, (fn) => fn.call(this, {
      subject: this.get(SUBJECT_KEY),
      translate: this.get(TRANSLATE_KEY)
    }));
  };

  return { dependentKeys, validate };
})
