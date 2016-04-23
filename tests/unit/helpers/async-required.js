import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
const { RSVP, run } = Ember;

export default validationRule(function(args, { onProperty }) {
  return {
    dependentKeys: [onProperty],
    validate(subject) {
      return new RSVP.Promise(function(resolve) {
        let errors = subject[onProperty] ? ['is required'] : [];
        run.later(resolve(errors), 10);
      });
    }
  };
});
