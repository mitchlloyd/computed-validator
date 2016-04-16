import { module, test } from 'qunit';
import { createValidator } from 'computed-validator';
import asyncRule from './helpers/async-rule';
import { nextValidator } from 'computed-validator/validator';

module("Unit | async-validation");

test('asynchronous validation - resolving with an error', function(assert) {
  let validator = createValidator({}, {
    name: asyncRule(['an error'])
  });

  assert.equal(validator.isValidating, true, "in isValidating state");
  assert.equal(validator.isValid, false, "not in isValid state");

  return nextValidator(validator).then(function(validator) {
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

  return nextValidator(validator).then(function(validator) {
    assert.equal(validator.isValidating, false, "Validator leaves isValidating state");
    assert.equal(validator.isValid, true, "Validator isValid");
  });
});
