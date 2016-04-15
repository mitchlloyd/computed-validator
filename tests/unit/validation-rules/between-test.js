import { module, test } from 'qunit';
import { createValidator, between, onProperty } from 'computed-validator';

module("Unit | validation-rules | between");

test('using between', function(assert) {
  let user = { name: 'Joe' };

  let validator = createValidator(user, {
    name: onProperty('name.length', between(4, 5))
  });

  assert.deepEqual(validator.name.errors, ["must be between 4 and 5"]);
});

test('using between for minimum', function(assert) {
  let user = { name: 'Joe' };

  let validator = createValidator(user, {
    name: onProperty('name.length', between(4, Infinity))
  });

  assert.deepEqual(validator.name.errors, ["must be at least 4"]);
});

test('using between for maximum', function(assert) {
  let user = { name: 'Joe' };

  let validator = createValidator(user, {
    name: onProperty('name.length', between(-Infinity, 2))
  });

  assert.deepEqual(validator.name.errors, ["must be 2 or less"]);
});
