import Ember from 'ember';
import { module, test } from 'qunit';
import { createValidator } from 'computed-validator';
import asyncRule from './helpers/async-rule';
import wait from 'ember-test-helpers/wait';
const { get } = Ember;

module("Unit | async-validation");

test('asynchronous validation - resolving with an error', function(assert) {
  let validator = createValidator({}, {
    name: asyncRule(['an error'])
  });

  assert.equal(get(validator, 'isValidating'), true, "in isValidating state");
  assert.equal(get(validator, 'isValid'), false, "not in isValid state");

  return wait().then(() => {
    assert.equal(get(validator, 'isValidating'), false, "Validator leaves isValidating state");
    assert.equal(get(validator, 'isValid'), false, "Validator still not isValid");
  });
});

test('asynchronous validation - resolving with no errors', function(assert) {
  let validator = createValidator({}, {
    name: asyncRule([])
  });

  assert.equal(get(validator, 'isValidating'), true, "in isValidating state");
  assert.equal(get(validator, 'isValid'), false, "not in isValid state");

  return wait().then(() => {
    assert.equal(get(validator, 'isValidating'), false, "Validator leaves isValidating state");
    assert.equal(get(validator, 'isValid'), true, "Validator isValid");
  });
});
