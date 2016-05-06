import Ember from 'ember';
import { module, test } from 'qunit';
import wait from 'ember-test-helpers/wait';
import asyncRule from '../helpers/async-rule';
import {
  computedValidator,
  required,
  sequence
} from 'computed-validator';
const { set } = Ember;

module("Unit | computed-validator");

test('using computedValidator', function(assert) {
  let user = {};

  let myObject = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.user = user;
    },

    validator: computedValidator('user', {
      name: required()
    })
  }).create();

  set(user, 'name', '');

  let errors = myObject.get('validator.name.errors');
  assert.deepEqual(errors, ["is required"]);

  set(user, 'name', 'Ellie');

  errors = myObject.get('validator.name.errors');
  assert.deepEqual(errors, []);
});

test('discarding obsolete promises', function(assert) {
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

  // Sync rule becomes invalid, with promise still pending
  myObject.set('user.name', '');
  assert.deepEqual(myObject.get('validator.name.errors'), ['is required'], "validator now has the sync error");

  return wait().then(function() {
    assert.deepEqual(myObject.get('validator.name.errors'), ['is required'], "after promise resolves, sync error remains");
  });
});
