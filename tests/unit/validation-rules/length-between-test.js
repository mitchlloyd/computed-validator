import { module, test } from 'qunit';
import { createValidator, lengthBetween } from 'computed-validator';

module("Unit | validation-rules | length-between");

test('using lengthBetween', function(assert) {
  let user = { name: 'Joe' };

  let validator = createValidator(user, {
    name: lengthBetween(4, 5)
  });

  assert.deepEqual(validator.get('name.errors'), ["length must be between 4 and 5"]);
});
