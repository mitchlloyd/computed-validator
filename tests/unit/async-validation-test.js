import { module, test } from 'qunit';
import { createValidator } from 'computed-validator';
import asyncRule from './helpers/async-rule';
import { nextValidationState } from 'computed-validator/validation-state';

module("Unit | async-validation");

test('asynchronous validation - resolving with an error', function(assert) {
  let validator = createValidator({}, {
    name: asyncRule(['an error'])
  });

  assert.equal(validator.isValidating, true, "in isValidating state");
  assert.equal(validator.isValid, false, "not in isValid state");

  return nextValidationState(validator.name).then(function() {
    assert.equal(validator.isValidating, false, "Validator leaves isValidating state");
    assert.equal(validator.isValid, false, "Validator still not isValid");
  });
});

test('asynchronous validation - resolving with no errors', function(assert) {
  let validator = createValidator({}, {
    name: asyncRule([])
  });

  assert.equal(validator.isValidating, true, "in isValidating state");
  assert.equal(validator.isValid, false, "not in isValid state");

  return nextValidationState(validator.name).then(function() {
    assert.equal(validator.isValidating, false, "Validator leaves isValidating state");
    assert.equal(validator.isValid, true, "Validator isValid");
  });
});
