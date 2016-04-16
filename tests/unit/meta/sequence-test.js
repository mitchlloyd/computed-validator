import { module, test, skip } from 'qunit';
import { sequence, required, integer } from 'computed-validator';
import asyncRule from '../helpers/async-rule';
import { nextValidationState } from 'computed-validator/validation-state';
import { defineValidator } from 'computed-validator/validator';

module("Unit | meta | sequence");

test('synchronous sequence', function(assert) {
  let Validator = defineValidator({
    age: sequence(required(), integer())
  });

  let subject = { age: null };

  let validator = new Validator({ subject });
  assert.deepEqual(validator.age.errors, ['is required']);

  subject.age = 'hello';
  validator = new Validator({ subject });
  assert.deepEqual(validator.age.errors, ['must be a whole number']);

  subject.age = 1;
  validator = new Validator({ subject });
  assert.deepEqual(validator.age.errors, []);
});

test('async sequence - async validation rule with no errors after sync validation rule', function(assert) {
  assert.expect(5);

  let Validator = defineValidator({
    name: sequence(required(), asyncRule([]))
  });

  let subject = { name: null };
  let validator = new Validator({ subject });
  assert.deepEqual(validator.name.errors, ['is required'], "gets first error");

  subject = { name: "Ellie" };
  validator = new Validator({ subject });
  assert.deepEqual(validator.name.errors, [], "no error messages");
  assert.equal(validator.name.isValidating, true, "validation rule isValidating");

  return nextValidationState(validator.name).then(function(validation) {
    assert.deepEqual(validation.errors, [], "There are no errors");
    assert.equal(validation.isValidating, false, "validation rule is no longer validating");
  });
});

test('async sequence - async validation rule with no errors before sync validation rule', function(assert) {
  assert.expect(4);

  let Validator = defineValidator({
    age: sequence(asyncRule([]), integer())
  });

  let subject = { age: null };
  let validator = new Validator({ subject });
  assert.deepEqual(validator.age.errors, [], "no error messages");
  assert.equal(validator.age.isValidating, true, "validation rule isValidating");

  return nextValidationState(validator.age).then(function(validation) {
    assert.deepEqual(validation.errors, ['must be a whole number'], "gets first error");
    assert.equal(validation.isValidating, false, "validation rule is no longer validating");
  });
});

test('async sequence - async validation rule with errors before sync validation rule', function(assert) {
  assert.expect(4);

  let Validator = defineValidator({
    age: sequence(asyncRule(['async-error']), integer())
  });

  let subject = { age: null };
  let validator = new Validator({ subject });
  assert.deepEqual(validator.age.errors, [], "no error messages");
  assert.equal(validator.age.isValidating, true, "validation rule isValidating");

  return nextValidationState(validator.age).then(function(validation) {
    assert.deepEqual(validation.errors, ['async-error'], "gets first error");
    assert.equal(validation.isValidating, false, "validation rule is no longer validating");
  });
});

test('async sequence - async validation rule with errors after sync validation rule', function(assert) {
  assert.expect(5);

  let Validator = defineValidator({
    name: sequence(required(), asyncRule(['async-error']))
  });

  let subject = { name: null };
  let validator = new Validator({ subject });
  assert.deepEqual(validator.name.errors, ['is required'], "gets first error");

  subject = { name: "Ellie" };
  validator = new Validator({ subject });
  assert.deepEqual(validator.name.errors, [], "no error messages");
  assert.equal(validator.name.isValidating, true, "validation rule isValidating");

  return nextValidationState(validator.name).then(function(validation) {
    assert.deepEqual(validation.errors, ['async-error'], "gets the async error");
    assert.equal(validation.isValidating, false, "validation rule is no longer validating");
  });
});

// Needs to be tested against computed
skip('async sequence - sync validation rule becomes invalid while waiting on async rule that returns no errors', function(assert) {
  assert.expect(5);

  let Validator = defineValidator({
    name: sequence(required(), asyncRule([]))
  });

  let subject = { name: "Ellie" };
  let validator = new Validator({ subject });
  assert.equal(validator.name.isValidating, true, "waiting on pending rule");
  assert.deepEqual(validator.name.errors, [], "no errors while waiting on pending rule");

  let pendingValidationState = validator.name;

  // Sync rule becomes invalid, with promise still pending
  subject = { name: null };
  assert.deepEqual(validator.name.errors, ['is required'], "validator now has the sync error");

  return nextValidationState(pendingValidationState).then(function(validation) {
    assert.deepEqual(validation.errors, [], "next validation state has no errors");
    assert.deepEqual(validator.name.errors, ['is required'], "but the current state from validator does have errors");
  });
});
