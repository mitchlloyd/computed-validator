import { module, test } from 'qunit';
import { defineValidator, required, when } from 'computed-validator';

module("Unit | meta | when");

test('using when', function(assert) {
  let subject = { dogName: null, isDog: false  };

  let Validator = defineValidator({
    dogName: when('isDog', required())
  });

  let validator = new Validator({ subject });
  assert.deepEqual(validator.dogName.errors, []);

  subject = { dogName: null, isDog: true  };
  validator = new Validator({ subject });
  assert.deepEqual(validator.dogName.errors, ['is required']);
});
