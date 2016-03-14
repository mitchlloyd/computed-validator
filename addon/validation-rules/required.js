import Ember from 'ember';
import { validate } from 'computed-validator';
import validationRule from 'computed-validator/validation-rule';
const { get } = Ember;

export default validationRule(function({ args, key }) {
  return {
    dependentKeys: [key],
    fn({ subject, translate }) {
      if (!get(subject, key)) {
        return [translate('validations.required', { property: key })];
      } else {
        return [];
      }
    }
  };
})
