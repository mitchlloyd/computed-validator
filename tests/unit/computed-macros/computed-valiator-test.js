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

test('discarding obsolete promises', function(assert) {
  assert.expect(4);
  let done = assert.async();

  let finish = function() {
    assert.deepEqual(myObject.get('validator.name.errors'), ['is required'], "after promise resolves, sync error remains");
    done();
  };

  let user = { name: 'Ellie' };

  let myObject = Ember.Object.extend({
    validator: computedValidator('user', {
      name: sequence(required(), asyncRule([], finish))
    })
  }).create();

  myObject.set('user', user);

  assert.equal(myObject.get('validator.name.isValidating'), true, "waiting on pending rule");
  assert.deepEqual(myObject.get('validator.name.errors'), [], "no errors while waiting on pending rule");

  // Sync rule becomes invalid, with promise still pending
  myObject.set('user.name', '');
  assert.deepEqual(myObject.get('validator.name.errors'), ['is required'], "validator now has the sync error");
});
