import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
const { RSVP, run } = Ember;

export default validationRule(function([errors], { onProperty }) {
  return {
    dependentKeys: [onProperty],
    validate() {
      return new RSVP.Promise(function(resolve) {
        run.later(function() {
          resolve(errors);
        }, 10);
      });
    }
  };
});
