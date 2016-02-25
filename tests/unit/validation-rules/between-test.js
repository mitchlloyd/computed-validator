import { module, test } from 'qunit';
import { createValidator, between, onProperty } from 'computed-validator';

module("Unit | validation-rules | between");

test('using between', function(assert) {
  let user = { name: 'Joe' };

  let validator = createValidator(user, {
    name: onProperty('name.length', between(4, 5))
  });

  assert.deepEqual(validator.get('name.errors'), ["must be greater than or equal to 4"]);
});
