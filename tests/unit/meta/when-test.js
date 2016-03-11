import Ember from 'ember';
import { module, test } from 'qunit';
import { createValidator, required, when } from 'computed-validator';
const { set } = Ember;

module("Unit | meta | when");

test('using when', function(assert) {
  let user = { dogName: null, isDog: false  };

  let validator = createValidator(user, {
    dogName: when('isDog', required())
  });

  assert.deepEqual(validator.get('dogName.errors'), []);

  set(user, 'isDog', true);

  assert.deepEqual(validator.get('dogName.errors'), ['is required']);
});
