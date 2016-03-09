import Ember from 'ember';
import { SUBJECT_KEY } from 'computed-validator';
const { get } = Ember;

export default function metaNegate(validationRule) {
  return function metaNegate_getBlueprint(defaultKey) {
    let { dependentKeys, fn } = validationRule(defaultKey);

    let negatedFn = function() {
      let errors = fn.apply(this);
      if (errors.length) {
        return []
      } else {
        return ["should be opposite"];
      }
    }

    return {
      dependentKeys,
      fn: negatedFn
    };
  }
}
