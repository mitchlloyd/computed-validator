import Ember from 'ember';
import { module, test } from 'qunit';
import { createValidator, confirmed } from 'computed-validator';
const { set } = Ember;

module("Unit | validation-rules | confirmed");

test('using confirmed', function(assert) {
  let user = { name: null, nameConfirmation: null };

  let validator = createValidator(user, {
    nameConfirmation: confirmed('name')
  });

  set(user, 'name', "Millie");

  assert.deepEqual(validator.nameConfirmation.errors, ["must match name"]);
});
