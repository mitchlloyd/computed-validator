import { module, test } from 'qunit';
import { createValidator, sequence, integer, required } from 'computed-validator';

module("Unit | meta | sequence");

test('using sequence', function(assert) {
  let user = { age: null };

  let validator = createValidator(user, {
    age: sequence(required(), integer())
  });

  assert.deepEqual(validator.get('age.errors'), ['is required']);
});
