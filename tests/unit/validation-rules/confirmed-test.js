import Ember from 'ember';
import { module, test } from 'qunit';
import { defineValidator, confirmed } from 'computed-validator';
const { get } = Ember;

module("Unit | validation-rules | confirmed");

test('using confirmed', function(assert) {
  let Validator = defineValidator({
    nameConfirmation: confirmed('name')
  });

  let subject = { name: null, nameConfirmation: null };
  let validator = new Validator({ subject });

  assert.deepEqual(get(validator, 'nameConfirmation.errors'), []);

  subject = { name: 'Millie', nameConfirmation: null };
  validator = new Validator({ subject, ancestor: validator });

  assert.deepEqual(get(validator, 'nameConfirmation.errors'), ["must match name"]);
});
