import { module, test } from 'qunit';
import { createValidator, required } from 'computed-validator';

module("Unit | validation-rules | required");

test('using required', function(assert) {
  let user = { name: null };

  let validator = createValidator(user, {
    name: required()
  });

  assert.deepEqual(validator.get('name.errors'), ["is required"]);
});
