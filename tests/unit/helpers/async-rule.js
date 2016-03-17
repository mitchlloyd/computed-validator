import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
import validate from 'computed-validator/validate';
const { RSVP, run } = Ember;

export default validationRule(function([errors], key) {
  if (!errors) {
    let errors = [];
  }

  return validate(key, function() {
    return new RSVP.Promise(function(resolve) {
      run.later(resolve(errors), 10);
    });
  });
});
