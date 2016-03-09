import { module, test } from 'qunit';
import { createValidator, lengthBetween } from 'computed-validator';

module("Unit | validation-rules | length-between");

test('using lengthBetween', function(assert) {
  let user = { name: 'Joe' };

  let validator = createValidator(user, {
    name: lengthBetween(4, 5)
  });

  assert.deepEqual(validator.get('name.errors'), ["must be greater than or equal to 4"]);
});
