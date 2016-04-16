import ValidationState from 'computed-validator/validation-state';
import { module, test } from 'qunit';

module("Unit | validation-state");

test('isValid - with errors', function(assert) {
  let state = new ValidationState({ errors: ["error"] });
  assert.strictEqual(state.isValid, false);
});

test('isValid - without errors', function(assert) {
  let state = new ValidationState({ errors: [] });
  assert.strictEqual(state.isValid, true);
});

test('hasErrors - with errors', function(assert) {
  let state = new ValidationState({ errors: ["error"] });
  assert.strictEqual(state.hasErrors, true);
});

test('hasErrors - without errors', function(assert) {
  let state = new ValidationState({ errors: [] });
  assert.strictEqual(state.hasErrors, false);
});

test('firstError - with errors', function(assert) {
  let state = new ValidationState({ errors: ["first-error", "last-error"] });
  assert.strictEqual(state.firstError, "first-error");
});

test('firstError - without errors', function(assert) {
  let state = new ValidationState({ errors: [] });
  assert.strictEqual(state.firstError, null);
});

test('errors', function(assert) {
  let state = new ValidationState({ errors: ["error"] });
  assert.deepEqual(state.errors, ["error"]);
});
