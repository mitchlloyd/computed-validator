import { module, test } from 'qunit';
import { match, createValidator } from 'computed-validator';

module("Unit | validation-rules | match");

test('using match', function(assert) {
  let user = { name: 'Joe' };

  let validator = createValidator(user, {
    name: match(/Mitch/)
  });

  assert.deepEqual(validator.get('name.errors'), ["must match /Mitch/"]);
});
