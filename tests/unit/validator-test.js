import Ember from 'ember';
import { module, test } from 'qunit';
import { createValidator, required, integer } from 'computed-validator';
const { set } = Ember;

module("Unit | validator", {
  beforeEach() {
    this.user = { name: "Nikki", age: 12 };

    this.validator = createValidator(this.user, {
      name: required(),
      age: integer(),
    });
  }
});

test('validator properties', function(assert) {
  assert.equal(this.validator.get('isValid'), true, "isValid with valid properties");
  set(this.user, 'name', null);
  assert.equal(this.validator.get('isValid'), false, "is not valid with an invalid property");
});
