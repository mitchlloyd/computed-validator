import Ember from 'ember';
import defineValidator, { SUBJECT_KEY } from 'computed-validator';
const { computed } = Ember;

export default function(dependentKey, rules) {
  let Validator = defineValidator(rules);

  return computed(dependentKey, function() {
    return Validator.create({ [SUBJECT_KEY]: this.get(dependentKey) });
  });
}
