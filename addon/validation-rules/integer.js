import Ember from 'ember';
import { validate } from 'computed-validator';
import validationRule from 'computed-validator/validation-rule';
const { get } = Ember;
const DEFAULT_MESSAGE = "must be an integer";

export default validationRule(function({ args, key }) {
  return {
    dependentKeys: [key],

    fn({ subject }) {
      let value = get(subject, key);

      if (!value) {
        return [DEFAULT_MESSAGE];
      }

      if (!value.toString().trim().match(/^[+-]?\d+$/)) {
        return [DEFAULT_MESSAGE];
      }

      return [];
    }
  };
})
