import validationRule from 'computed-validator/validation-rule';
import { createValidator } from 'computed-validator';
import { module, test } from 'qunit';
import Ember from 'ember';
const { set } = Ember;

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

  let subject = { bool: false };

  let validator = createValidator(subject, {
    prop: rule({ when: 'bool' })
  });

  assert.deepEqual(validator.prop.errors, [], "errors are empty when property is false");

  set(subject, 'bool', true);

  assert.deepEqual(validator.prop.errors, ['error'], "has errors when property becomes true");
});
