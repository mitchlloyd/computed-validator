import Ember from 'ember';
import { validate } from 'computed-validator';
import validationRule from 'computed-validator/validation-rule';
const { get } = Ember;

export default validationRule(function({ args: forbiddenValues, key }) {
  return {
    dependentKeys: [key],

    validate(subject) {
      let value = get(subject, key);

      if (forbiddenValues.indexOf(value) !== -1) {
        let values = forbiddenValues.join(', ');
        return [`cannot be one of: ${values}`];
      } else {
        return [];
      }
    }
  };
})
