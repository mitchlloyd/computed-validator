import Ember from 'ember';
import { validate, validationRule } from 'computed-validator';
const { get } = Ember;

function required() {
  return validate(function({ subject, key, translate }) {
    if (!get(subject, key)) {
      return translate('validations.required', { property: key });
    }
  });
}

/*
function required({ message }) {
  return validate({
    dependentKeys(key) { return key },

    validation({ subject, key, message }) {
      if (!get(subject, key)) {
        return message;
      }
    },

    compile(key, declarationArgs, translate) {
      let { message } = declarationArgs;
      if (!message) {
        return {
          dependentKeys: [key],
          validation() {},
      } else {
        return translate({ message })
      }
    }
  });
}


class ValidationRule {
  constructor(...args) {
    this.args = args;
  },

  build(key) {
    this.key = key;
  },

  validate() {
  }
}

validationRule(function({ args, key }) {
  let message = messageOption(args) || {
    key: 'validations.required',
    properties: { property: key }
  });

  return {
    dependentKeys: [key],
    validation() {
      if (!get(subject, key)) {
        return message;
      }
    }
  }
});

validationRule(function({ args, subject, key, translate }) {
  return {
    dependentKeys: getDependentKeys(args),
    validation: getValidationFuntion(args)
  }
})

  // return validate(key, function() {
  //   if (!get(subject, key)) {
  //     return message;
  //   }
  // });
// });

export default validationRule(required);
*/
