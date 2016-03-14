import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
const { get } = Ember;

export default validationRule(function({ args, key }) {
  let [whenKey, rule] = args;
  let { dependentKeys, fn } = rule(key);

  let wrappedFn = function({ subject, translate }) {
    if (get(subject, whenKey)) {
      return fn.call(this, { subject, translate });
    } else {
      return [];
    }
  };

  return {
    dependentKeys: dependentKeys.concat(whenKey),
    fn: wrappedFn
  };
});
