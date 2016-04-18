import { SUBJECT_KEY } from 'computed-validator/validator/private-keys';
import { module, test } from 'qunit';
import { initCache, transferCache } from 'computed-validator/utils/cache';
import defineMemoizedGetter from 'computed-validator/utils/define-memoized-getter';

module("Unit | transition-cache");

test('indefinite caching', function(assert) {
  let callCount = 0;

  let Klass = function() {
    initCache(this);
  };

  defineMemoizedGetter(Klass, 'ruleKey', [], function() {
    callCount++;
    return 'hi';
  });

  let obj = new Klass();

  assert.equal(obj.ruleKey, 'hi');
  assert.equal(obj.ruleKey, 'hi');
  assert.equal(callCount, 1);
});

test('caching values that need revalidation', function(assert) {
  let callCount = 0;
  let subject = { name: 'bill' };

  let Klass = function() {
    this[SUBJECT_KEY] = subject;
    initCache(this);
  };

  defineMemoizedGetter(Klass, 'ruleKey', ['name'], function() {
    callCount++;
    return this[SUBJECT_KEY].name;
  });

  let obj1 = new Klass();
  let obj2 = new Klass();
  let obj3 = new Klass();

  assert.equal(obj1.ruleKey, 'bill', "First call returns and caches value");

  transferCache(obj1, obj2);

  assert.equal(obj2.ruleKey, 'bill', "After cache transfer, still get original value");
  assert.equal(callCount, 1, "did not need another call because value did not change");

  transferCache(obj2, obj3);
  subject.name = 'sam';

  assert.equal(obj2.ruleKey, 'sam', "Should get updated value");
  assert.equal(callCount, 2, "Another call was needed");

  assert.equal(obj2.ruleKey, 'sam', "More calls returned cached value");
  assert.equal(callCount, 2, "But call count does not increase");
});
