import { module, test } from 'qunit';
import { createValidator, sequence, required, integer } from 'computed-validator';
import asyncRule from '../helpers/async-rule';
import { nextValidationState } from 'computed-validator/validation-state';
import Ember from 'ember';
const { set } = Ember;

module("Unit | meta | sequence");

test('using sequence', function(assert) {
  let user = { age: null };

  let validator = createValidator(user, {
    age: sequence(required(), integer())
  });

  assert.deepEqual(validator.get('age.errors'), ['is required']);

  set(user, 'age', 'hello');

  assert.deepEqual(validator.get('age.errors'), ['must be a whole number']);

  set(user, 'age', 1);

  assert.deepEqual(validator.get('age.errors'), []);
});

test('using sequence - async validation rule with no errors after sync validation rule', function(assert) {
  assert.expect(5);

  let user = { name: null };

  let validator = createValidator(user, {
    name: sequence(required(), asyncRule([]))
  });

  assert.deepEqual(validator.get('name.errors'), ['is required'], "gets first error");

  set(user, 'name', "Ellie");

  assert.deepEqual(validator.get('name.errors'), [], "no error messages");
  assert.equal(validator.get('name.isValidating'), true, "validation rule isValidating");

  return nextValidationState(validator.get('name')).then(function(validation) {
    assert.deepEqual(validation.errors, [], "There are no errors");
    assert.equal(validation.isValidating, false, "validation rule is no longer validating");
  });
});

test('using sequence - async validation rule with no errors before sync validation rule', function(assert) {
  assert.expect(4);

  let user = { age: null };

  let validator = createValidator(user, {
    age: sequence(asyncRule([]), integer())
  });

  assert.deepEqual(validator.get('age.errors'), [], "no error messages");
  assert.equal(validator.get('age.isValidating'), true, "validation rule isValidating");

  return nextValidationState(validator.get('age')).then(function(validation) {
    assert.deepEqual(validation.errors, ['must be a whole number'], "gets first error");
    assert.equal(validation.isValidating, false, "validation rule is no longer validating");
  });
});

test('using sequence - async validation rule with errors before sync validation rule', function(assert) {
  assert.expect(4);

  let user = { age: null };

  let validator = createValidator(user, {
    age: sequence(asyncRule(['async-error']), integer())
  });

  assert.deepEqual(validator.get('age.errors'), [], "no error messages");
  assert.equal(validator.get('age.isValidating'), true, "validation rule isValidating");

  return nextValidationState(validator.get('age')).then(function(validation) {
    assert.deepEqual(validation.errors, ['async-error'], "gets first error");
    assert.equal(validation.isValidating, false, "validation rule is no longer validating");
  });
});

test('using sequence - async validation rule with errors after sync validation rule', function(assert) {
  assert.expect(5);

  let user = { name: null };

  let validator = createValidator(user, {
    name: sequence(required(), asyncRule(['async-error']))
  });

  assert.deepEqual(validator.get('name.errors'), ['is required'], "gets first error");

  set(user, 'name', "Ellie");

  assert.deepEqual(validator.get('name.errors'), [], "no error messages");
  assert.equal(validator.get('name.isValidating'), true, "validation rule isValidating");

  return nextValidationState(validator.get('name')).then(function(validation) {
    assert.deepEqual(validation.errors, ['async-error'], "gets the async error");
    assert.equal(validation.isValidating, false, "validation rule is no longer validating");
  });
});
