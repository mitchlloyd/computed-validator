import Ember from 'ember';
import { module, test } from 'qunit';
import { match, createValidator } from 'computed-validator';
const { get } = Ember;

module("Unit | validation-rules | match");

test('using match', function(assert) {
  let user = { name: 'Joe' };

  let validator = createValidator(user, {
    name: match(/Mitch/)
  });

  assert.deepEqual(get(validator, 'name.errors'), ["must match /Mitch/"]);
});
