import Ember from 'ember';
import { module, test } from 'qunit';
import { createValidator, lengthInRange } from 'computed-validator';
const { get } = Ember;

module("Unit | validation-rules | length-in-range");

test('using lengthInRange', function(assert) {
  let user = { name: 'Joe' };

  let validator = createValidator(user, {
    name: lengthInRange(4, 5)
  });

  assert.deepEqual(get(validator, 'name.errors'), ["length must be between 4 and 5 characters"]);
});
