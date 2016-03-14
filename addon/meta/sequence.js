import { metaBlueprintFor } from './utils';
import validationRule from 'computed-validator/validation-rule';

export default validationRule(function({ args, key }) {
  let { dependentKeys, fns } = metaBlueprintFor(args, key);

  let fn = function(fnParams) {
    let allErrors = [];

    for (fn of fns) {
      let errors = fn.call(this, fnParams);

      if (errors.length) {
        allErrors.push(...errors);
        return allErrors
      }
    }

    return [];
  };

  return { dependentKeys, fn };
});
