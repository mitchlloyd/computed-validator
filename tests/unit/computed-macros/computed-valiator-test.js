import Ember from 'ember';
import { module, test } from 'qunit';
import asyncRule from '../helpers/async-rule';
import { nextValidator } from 'computed-validator/validator';
import {
  computedValidator,
  required,
  sequence
} from 'computed-validator';

module("Unit | computed-validator");

test('using computedValidator', function(assert) {
  let myObject = Ember.Object.extend({
    validator: computedValidator('attrs.user', {
      name: required()
    })
  }).create();

  myObject.set('attrs', { user: { name: '' } });

  let errors = myObject.get('validator.name.errors');
  assert.deepEqual(errors, ["is required"]);
});

test('descarding obsolete promises', function(assert) {
  assert.expect(4);

  let user = { name: 'Ellie' };

  let myObject = Ember.Object.extend({
    validator: computedValidator('user', {
      name: sequence(required(), asyncRule([]))
    })
  }).create();

  myObject.set('user', user);

  assert.equal(myObject.get('validator.name.isValidating'), true, "waiting on pending rule");
  assert.deepEqual(myObject.get('validator.name.errors'), [], "no errors while waiting on pending rule");

  let pendingValidator = myObject.get('validator');

  // Sync rule becomes invalid, with promise still pending
  myObject.set('user.name', '');
  assert.deepEqual(myObject.get('validator.name.errors'), ['is required'], "validator now has the sync error");

  return nextValidator(pendingValidator).then(function(validator) {
    assert.deepEqual(validator.errors, [], "next validation state has no errors");
  });
});
