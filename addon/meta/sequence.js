import { SUBJECT_KEY } from 'computed-validator/validator';
import { metaBlueprintFor } from './utils';

export default function metaSequence(...validationRules) {
  return function metaSequence_getBlueprint(key) {
    let { dependentKeys, fns } = metaBlueprintFor(validationRules, key);

    let fn = function() {
      let allErrors = [];

      for (fn of fns) {
        let errors = fn.apply(this, this.get(SUBJECT_KEY));

        if (errors.length) {
          allErrors.push(...errors);
          return allErrors
        }
      }

      return [];
    };

    return { dependentKeys, fn };
  };
}
