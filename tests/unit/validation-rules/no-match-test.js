import Ember from 'ember';
import { module, test } from 'qunit';
import { noMatch, createValidator } from 'computed-validator';
const { get } = Ember;

module("Unit | validation-rules | no-match");

test('using match', function(assert) {
  let user = { name: 'Mitch' };

  let validator = createValidator(user, {
    name: noMatch(/Mitch/)
  });

  assert.deepEqual(get(validator, 'name.errors'), ["must not match /Mitch/"]);
});
