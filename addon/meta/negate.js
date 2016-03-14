import Ember from 'ember';
import { SUBJECT_KEY } from 'computed-validator';
import validationRule from 'computed-validator/validation-rule';
const { get } = Ember;

export default validationRule(function({ args: [rule], key }) {
  let { dependentKeys, fn } = rule(key);

  let negatedFn = function(...args) {
    let errors = fn.apply(this, args);
    if (errors.length) {
      return []
    } else {
      return ["should be opposite"];
    }
  }

  return {
    dependentKeys,
    fn: negatedFn
  };
})
