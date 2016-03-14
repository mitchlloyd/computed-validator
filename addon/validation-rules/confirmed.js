import Ember from 'ember';
import { validate, SUBJECT_KEY } from 'computed-validator';
import validationRule from 'computed-validator/validation-rule';
const { get } = Ember;

export default validationRule(function({ args, key }) {
  let keyToMatch = args[0];

  return {
    dependentKeys: [key, `${SUBJECT_KEY}.${keyToMatch}`],

    validate({ subject }) {
      if (get(subject, key) !== get(subject, keyToMatch)) {
        return [`must match ${keyToMatch}`];
      } else {
        return [];
      }
    }
  };
})
