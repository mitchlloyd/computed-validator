import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
const { get } = Ember;

export default validationRule(function({ args: [regex], key }) {
  return {
    dependentKeys: [key],

    fn({ subject }) {
      let value = get(subject, key);
      if (!regex.test(value)) {
        return [`must match ${regex.toString()}`];
      } else {
        return [];
      }
    }
  };
})
