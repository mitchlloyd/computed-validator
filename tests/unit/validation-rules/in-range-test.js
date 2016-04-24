import { module, test } from 'qunit';
import { createValidator, inRange, onProperty } from 'computed-validator';

module("Unit | validation-rules | in-range");

test('using inRange', function(assert) {
  let user = { name: 'Joe' };

  let validator = createValidator(user, {
    name: onProperty('name.length', inRange(4, 5))
  });

  assert.deepEqual(validator.name.errors, ["must be between 4 and 5"]);
});

test('using inRange for minimum', function(assert) {
  let user = { name: 'Joe' };

  let validator = createValidator(user, {
    name: onProperty('name.length', inRange(4, Infinity))
  });

  assert.deepEqual(validator.name.errors, ["must be at least 4"]);
});

test('using inRange for maximum', function(assert) {
  let user = { name: 'Joe' };

  let validator = createValidator(user, {
    name: onProperty('name.length', inRange(-Infinity, 2))
  });

  assert.deepEqual(validator.name.errors, ["must be 2 or less"]);
});
