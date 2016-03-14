import { module, test } from 'qunit';
import { createValidator, integer } from 'computed-validator';

module("Unit | validation-rules | integer");

test('given an integer', function(assert) {
  let validator = buildValidator({ age: "12" });
  assert.deepEqual(validator.get('age.errors'), []);
});

test('given a float', function(assert) {
  let validator = buildValidator({ age: "12.01" });
  assert.deepEqual(validator.get('age.errors'), ["must be an integer"]);
});

test('given a non number', function(assert) {
  let validator = buildValidator({ age: "old" });
  assert.deepEqual(validator.get('age.errors'), ["must be an integer"]);
});

function buildValidator(user) {
  return createValidator(user, {
    age: integer(),
  });
}
