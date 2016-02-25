import Ember from 'ember';
import { module, test } from 'qunit';
import { createValidator, validate } from 'computed-validator/validator';
const { get } = Ember;

module("Unit | validate");

test('using validate with an explicit key', function(assert) {
  let user = { name: null };

  let validator = createValidator(user, {
    name: validate('name', function(subject, key) {
      if (!get(subject, key)) {
        return "is required";
      }
    })
  });

  assert.deepEqual(validator.get('name.errors'), ["is required"]);
});

test('using validate with an implicit key', function(assert) {
  let user = { name: null };

  let validator = createValidator(user, {
    name: validate(function(subject, key) {
      if (!get(subject, key)) {
        return "is required";
      }
    })
  });

  assert.deepEqual(validator.get('name.errors'), ["is required"]);
});
