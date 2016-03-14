import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
const { get } = Ember;

export default validationRule(function({ args, key }) {
  let [whenKey, rule] = args;
  let { dependentKeys, validate } = rule(key);

  let wrappedValidate = function({ subject, translate }) {
    if (get(subject, whenKey)) {
      return validate.call(this, { subject, translate });
    } else {
      return [];
    }
  };

  return {
    dependentKeys: dependentKeys.concat(whenKey),
    validate: wrappedValidate
  };
});
