import Ember from 'ember';
import { module, test } from 'qunit';
import { defineValidator, required, integer } from 'computed-validator';
const { get } = Ember;

module("Unit | validator", {
  beforeEach() {
    this.Validator = defineValidator({
      name: required(),
      age: integer()
    });
  }
});

test('validator properties', function(assert) {
  let validator = new this.Validator({ subject: { name: "Nikki", age: 12 } });
  assert.equal(get(validator, 'isValid'), true, "isValid with valid properties");

  validator = new this.Validator({ subject: { name: null, age: 12 } });
  assert.equal(get(validator, 'isValid'), false, "is not valid with an invalid property");
});
