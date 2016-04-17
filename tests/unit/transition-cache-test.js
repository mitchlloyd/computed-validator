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

  // Value shoudl be cached now
  assert.equal(obj1.ruleKey, 'bill');

  transferCache(obj1, obj2);

  // Still getting the cached value
  assert.equal(obj2.ruleKey, 'bill');
  assert.equal(callCount, 1);

  // Cached transfered with { needsRevalidation: true }
  transferCache(obj2, obj3);
  subject.name = 'sam';

  // Get the cache with a revalidation check
  assert.equal(obj2.ruleKey, 'sam');
  assert.equal(callCount, 2);

  // Value is not indefinitely cached
  assert.equal(obj2.ruleKey, 'sam');
  assert.equal(callCount, 2);
});
