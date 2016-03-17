import Ember from 'ember';
import { module, test } from 'qunit';
import { createValidator, validate } from 'computed-validator';
import asyncRule from './helpers/async-rule';
import { nextValidationState } from 'computed-validator/validation-state';
const { RSVP } = Ember;

module("Unit | async-validation");

test('asynchronous validation - resolving with an error', function(assert) {
  let validator = createValidator({}, {
    name: asyncRule(['an error'])
  });

  assert.equal(validator.get('isValidating'), true, "in isValidating state");
  assert.equal(validator.get('isValid'), false, "not in isValid state");

  return nextValidationState(validator.get('name')).then(function() {
    assert.equal(validator.get('isValidating'), false, "Validator leaves isValidating state");
    assert.equal(validator.get('isValid'), false, "Validator still not isValid");
  });
});

test('asynchronous validation - resolving with no errors', function(assert) {
  let validator = createValidator({}, {
    name: asyncRule([])
  });

  assert.equal(validator.get('isValidating'), true, "in isValidating state");
  assert.equal(validator.get('isValid'), false, "not in isValid state");

  return nextValidationState(validator.get('name')).then(function() {
    assert.equal(validator.get('isValidating'), false, "Validator leaves isValidating state");
    assert.equal(validator.get('isValid'), true, "Validator isValid");
  });
});
