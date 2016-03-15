import { module, test } from 'qunit';
import { noMatch, createValidator } from 'computed-validator';

module("Unit | validation-rules | no-match");

test('using match', function(assert) {
  let user = { name: 'Mitch' };

  let validator = createValidator(user, {
    name: noMatch(/Mitch/)
  });

  assert.deepEqual(validator.get('name.errors'), ["Must not match /Mitch/"]);
});
