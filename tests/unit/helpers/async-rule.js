import Ember from 'ember';
import validationRule from 'computed-validator/validation-rule';
const { RSVP, run } = Ember;

export default validationRule(function([errors, callback], { onProperty }) {
  if (!callback) {
    callback = () => {};
  }

  return {
    dependentKeys: [onProperty],
    validate() {
      return new RSVP.Promise(function(resolve) {
        run.later(function() {
          resolve(errors);
          callback();
        }, 10);
      });
    }
  };
});
