import { SUBJECT_KEY } from 'computed-validator/validator';
import { flatMap } from 'computed-validator/utils';

export default function metaAll(...validationRules) {
  return function metaAll_getBlueprint(key) {
    let dependentKeys = [];
    let fns = [];

    validationRules.forEach((rule) => {
      let { dependentKeys, fn } = rule(key);
      dependentKeys.push(...dependentKeys);
      fns.push(fn);
    });

    let fn = function() {
      return flatMap(fns, (fn) => fn.apply(this, this.get(SUBJECT_KEY)));
    };

    return { dependentKeys, fn };
  };
}
