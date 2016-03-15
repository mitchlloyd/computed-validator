import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
const { get } = Ember;

export default validationRule(function([attr, rule, options], defaultKey) {
  let message = options && options.message;
  let { dependentKeys, validate } = rule(getAttribute(attr, defaultKey));

  return {
    dependentKeys,

    validate: function(...args) {
      let errors = validate(...args);
      if (errors.length && message) {
        return [message];
      } else {
        return errors;
      }
    }
  }

});

function getAttribute(attr, defaultKey) {
  if (typeof attr === 'function') {
    return attr(defaultKey);
  } else {
    return attr;
  }
}
