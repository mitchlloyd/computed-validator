import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
import validate from 'computed-validator/validate';
const { RSVP, run } = Ember;

export default validationRule(function(args, key) {
  return validate(key, function(subject) {
    return new RSVP.Promise(function(resolve) {
      let errors = subject[key] ? ['is required'] : [];
      run.later(resolve(errors), 10);
    });
  });
});
