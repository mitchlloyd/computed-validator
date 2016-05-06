import Ember from 'ember';
import { module, test } from 'qunit';
import { createValidator, required } from 'computed-validator';
const { get } = Ember;

module("Unit | validation-rules | required");

test('using required', function(assert) {
  let user = { name: null };

  let validator = createValidator(user, {
    name: required()
  });

  assert.deepEqual(get(validator, 'name.errors'), ["is required"]);
});
