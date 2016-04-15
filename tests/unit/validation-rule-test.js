import validationRule from 'computed-validator/validation-rule';
import { defineValidator, createValidator } from 'computed-validator';
import { module, test } from 'qunit';

module("Unit | validation-rule");

test('given a message option', function(assert) {
  let rule = validationRule(function() {
    return {
      dependentKeys: [],
      validate() { return ['error']; }
    };
  });

  let validator = createValidator({}, {
    prop: rule({ message: 'override' })
  });

  assert.deepEqual(validator.prop.errors, ['override'], "message overridden with option");
});

test('given a when option', function(assert) {
  let rule = validationRule(function() {
    return {
      dependentKeys: [],
      validate() { return ['error']; }
    };
  });

  let Validator = defineValidator({
    prop: rule({ when: 'bool' })
  });

  let subject = { bool: false };
  let validator = new Validator({ subject });
  assert.deepEqual(validator.prop.errors, [], "errors are empty when property is false");

  subject = { bool: true };
  validator = new Validator({ subject });
  assert.deepEqual(validator.prop.errors, ['error'], "has errors when property becomes true");
});
