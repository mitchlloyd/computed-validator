import Ember from 'ember';
import { module, test } from 'qunit';
import { computedValidator, required } from 'computed-validator';

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
