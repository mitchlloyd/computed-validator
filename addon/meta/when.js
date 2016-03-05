import Ember from 'ember';
import { SUBJECT_KEY } from 'computed-validator';
const { get } = Ember;

export default function metaWhen(whenKey, validationRule) {
  return function metaWhen_getBlueprint(defaultKey) {
    let whenSubjectKey = `${SUBJECT_KEY}.${whenKey}`;
    let { dependentKeys, fn } = validationRule(defaultKey);

    let wrappedFn = function() {
      if (this.get(whenSubjectKey)) {
        return fn.apply(this, this.get(SUBJECT_KEY));
      } else {
        return [];
      }
    }

    return {
      dependentKeys: dependentKeys.concat(whenSubjectKey),
      fn: wrappedFn
    };
  }
}
