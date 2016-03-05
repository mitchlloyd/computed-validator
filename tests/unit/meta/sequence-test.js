import { module, test } from 'qunit';
import { createValidator, sequence, integer, required } from 'computed-validator';
import { DEFAULT_MESSAGE as REQUIRED_ERROR_MESSAGE } from 'computed-validator/validation-rules/required';

module("Unit | meta | sequence");

test('using sequence', function(assert) {
  let user = { age: null };

  let validator = createValidator(user, {
    age: sequence(required(), integer())
  });

  assert.deepEqual(validator.get('age.errors'), [REQUIRED_ERROR_MESSAGE]);
});
