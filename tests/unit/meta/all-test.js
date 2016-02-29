import { module, test } from 'qunit';
import { createValidator, all, integer, required } from 'computed-validator';

module("Unit | meta | all");

test('using all', function(assert) {
  let user = { age: null };

  let validator = createValidator(user, {
    age: all(required(), integer())
  });

  assert.equal(validator.get('age.errors').length, 2);
});
