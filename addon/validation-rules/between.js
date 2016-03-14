import Ember from 'ember';
import { validate } from 'computed-validator';
import validationRule from 'computed-validator/validation-rule';
const { get } = Ember;

export default validationRule(function({ args, key }) {
  let [min, max] = args;

  return {
    dependentKeys: [key],

    validate(subject) {
      let value = get(subject, key);

      if (value >= max) {
        return [`must be less than or equal to ${max}`];
      } else if (value <= min) {
        return [`must be greater than or equal to ${min}`];
      } else {
        return [];
      }
    }
  };
})
