import Ember from 'ember';
import { module, test } from 'qunit';
import { createValidator, validate } from 'computed-validator';
const { get } = Ember;

module("Unit | validate");

test('using validate with an explicit key', function(assert) {
  let user = { name: null };

  let validator = createValidator(user, {
    name: validate('name', function() {
      if (!get(user, 'name')) {
        return "is required";
      }
    })
  });

  assert.deepEqual(validator.name.errors, ["is required"]);
});

test('using validate with an implicit key', function(assert) {
  let user = { name: null };

  let validator = createValidator(user, {
    name: validate(function() {
      if (!get(user, 'name')) {
        return "is required";
      }
    })
  });

  assert.deepEqual(validator.name.errors, ["is required"]);
});
