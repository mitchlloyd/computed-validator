import { metaBlueprintFor } from './utils';
import validationRule from 'computed-validator/validation-rule';
import { firstResult } from 'computed-validator/utils';

export default validationRule(function({ args, key }) {
  let { dependentKeys, validateFunctions } = metaBlueprintFor(args, key);

  let validate = function(fnParams) {
    return firstResult(validateFunctions, function(fn) {
      let errors = fn.call(this, fnParams);

      if (errors.length) {
        return errors;
      }
    }) || [];
  };

  return { dependentKeys, validate };
});
