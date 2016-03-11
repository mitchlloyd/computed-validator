import Ember from 'ember';
import defineValidator, { SUBJECT_KEY, OWNER_KEY } from 'computed-validator';
const { computed, getOwner } = Ember;

export default function(dependentKey, rules) {
  let Validator = defineValidator(rules);

  return computed(dependentKey, function() {
    let owner = getOwner(this);
    return Validator.create({
      [SUBJECT_KEY]: this.get(dependentKey),
      [OWNER_KEY]: owner
    });
  });
}
