import Ember from 'ember';
import { SUBJECT_KEY } from 'computed-validator';
import validationRule from 'computed-validator/validation-rule';
const { get } = Ember;

export default validationRule(function({ args: [rule], key }) {
  let { dependentKeys, validate } = rule(key);

  let negatedValidate = function(...args) {
    let errors = validate.apply(this, args);
    if (errors.length) {
      return []
    } else {
      return ["should be opposite"];
    }
  }

  return {
    dependentKeys,
    validate: negatedValidate
  };
})
