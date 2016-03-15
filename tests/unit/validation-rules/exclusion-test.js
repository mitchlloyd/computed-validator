import { module, test } from 'qunit';
import { createValidator, exclusion } from 'computed-validator';

module("Unit | validation-rules | exclusion");

test('using exclusion', function(assert) {
  let user = { name: 'poop' };

  let validator = createValidator(user, {
    name: exclusion('poop')
  });

  assert.deepEqual(validator.get('name.errors'), ["is not an allowed value"]);
});
