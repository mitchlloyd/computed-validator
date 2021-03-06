import Ember from 'ember';
import { module, test } from 'qunit';
import { createValidator, all, integer, required } from 'computed-validator';
import { nextValidationState } from 'computed-validator/validation-state';
import asyncRule from '../helpers/async-rule';
const { get } = Ember;

module("Unit | meta | all");

test('synchronous all', function(assert) {
  let user = { age: null };

  let validator = createValidator(user, {
    age: all(required(), integer())
  });

  assert.equal(get(validator, 'age.errors.length'), 2);
});

test('async all - with passing async validation', function(assert) {
  assert.expect(2);

  let user = { age: null };

  let validator = createValidator(user, {
    age: all(required(), asyncRule([]), integer())
  });

  assert.deepEqual(get(validator, 'age.errors'), [
    'is required',
    'must be a whole number'
  ], "only shows sync errors");

  return nextValidationState(get(validator, 'age')).then(function() {
    assert.deepEqual(
      get(validator, 'age.errors'),
      ['is required', 'must be a whole number'],
      "still only shows original sync errors"
    );
  });
});

test('async all - with failing async validation', function(assert) {
  assert.expect(2);

  let user = { age: null };

  let validator = createValidator(user, {
    age: all(required(), asyncRule(['async-error']), integer())
  });

  assert.deepEqual(get(validator, 'age.errors'), [
    'is required',
    'must be a whole number'
  ], "only shows sync errors");

  return nextValidationState(get(validator, 'age')).then(function(validationState) {
    assert.deepEqual(
      validationState.errors,
      ['is required', 'async-error', 'must be a whole number'],
      "shows resolved error in the middle"
    );
  });
});

test('async all - with only passing async validations', function(assert) {
  assert.expect(4);

  let validator = createValidator({}, {
    age: all(asyncRule([]), asyncRule([]))
  });

  assert.deepEqual(get(validator, 'age.errors'), [], "there are no errors while validating");
  assert.equal(get(validator, 'isValidating'), true, "validator is validating");

  return nextValidationState(get(validator, 'age')).then(function(validationState) {
    assert.deepEqual(validationState.errors, [], "there are no errors after resolution");
    assert.equal(validationState.isValidating, false, "validation is no longer validating");
  });
});
