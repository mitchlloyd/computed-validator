import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
const { get } = Ember;

export default validationRule(function({ args, key }) {
  let [whenKey, rule] = args;
  let { dependentKeys, validate } = rule(key);

  let wrappedValidate = function(subject) {
    if (get(subject, whenKey)) {
      return validate.call(this, subject);
    } else {
      return [];
    }
  };

  return {
    dependentKeys: dependentKeys.concat(whenKey),
    validate: wrappedValidate
  };
});
