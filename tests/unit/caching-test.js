import { module, test } from 'qunit';
import { initCache } from 'computed-validator/utils/cache';
import defineMemoizedGetter from 'computed-validator/utils/define-memoized-getter';

module("Unit | caching");

test('indefinite caching', function(assert) {
  let callCount = 0;

  let obj = {};
  initCache(obj, 'subject', undefined);

  defineMemoizedGetter(obj, 'ruleKey', [], function() {
    callCount++;
    return 'hi';
  });

  assert.equal(obj.ruleKey, 'hi');
  assert.equal(obj.ruleKey, 'hi');
  assert.equal(callCount, 1);
});

test('caching values that need revalidation', function(assert) {
  let callCount = 0;
  let subject = { name: 'bill' };

  let objects = [{ subject }, { subject }, { subject }];
  objects.forEach((obj) => {
    defineMemoizedGetter(obj, 'ruleKey', ['name'], function() {
      callCount++;
      return this.subject.name;
    });
  });

  initCache(objects[0], 'subject', undefined);
  assert.equal(objects[0].ruleKey, 'bill', "First call returns and caches value");

  initCache(objects[1], 'subject', objects[0]);
  assert.equal(objects[1].ruleKey, 'bill', "After cache transfer, still get original value");
  assert.equal(callCount, 1, "did not need another call because subject name did not change");

  subject.name = 'sam';

  initCache(objects[2], 'subject', objects[1]);
  assert.equal(objects[2].ruleKey, 'sam', "Should get updated value");
  assert.equal(callCount, 2, "Another call was needed");
  assert.equal(objects[2].ruleKey, 'sam', "More calls returned cached value");
  assert.equal(callCount, 2, "But call count does not increase");
});
