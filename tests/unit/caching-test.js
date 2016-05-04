import { module, test } from 'qunit';
import { initCache } from 'computed-validator/utils/cache';
import defineMemoizedGetter from 'computed-validator/utils/define-memoized-getter';

module("Unit | caching");

test('indefinite caching', function(assert) {
  let callCount = 0;

  let obj = {};
  initCache(obj);

  defineMemoizedGetter(obj, 'ruleKey', function() {
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
  let dependentKeyMap = { ruleKey: ['name'] };

  let objects = [{}, {}, {}];
  objects.forEach((obj) => {
    defineMemoizedGetter(obj, 'ruleKey', function() {
      callCount++;
      return subject.name;
    });
  });

  initCache(objects[0], subject, undefined, dependentKeyMap);
  assert.equal(objects[0].ruleKey, 'bill', "First call returns and caches value");

  initCache(objects[1], subject, objects[0], dependentKeyMap);
  assert.equal(objects[1].ruleKey, 'bill', "After cache transfer, still get original value");
  assert.equal(callCount, 1, "did not need another call because subject name did not change");

  subject.name = 'sam';

  initCache(objects[2], subject, objects[1], dependentKeyMap);
  assert.equal(objects[2].ruleKey, 'sam', "Should get updated value");
  assert.equal(callCount, 2, "Another call was needed");
  assert.equal(objects[2].ruleKey, 'sam', "More calls returned cached value");
  assert.equal(callCount, 2, "But call count does not increase");
});

test('Ember @each dependent key parity', function(assert) {
  let obj = {};
  let subject = {
    children: [{ name: 'sally' }, { name: 'sam' }],
  };
  let dependentKeyMap = {
    ruleKey: ['children.@each.name']
  };
  initCache(obj, subject, undefined, dependentKeyMap);

  let callCount = 0;
  defineMemoizedGetter(obj, 'ruleKey', function() {
    callCount++;
    return subject.children.map((c) => c.name).join('-');
  });

  assert.equal(obj.ruleKey, 'sally-sam', "first get works");
  assert.equal(callCount, 1, "first get results in one call");

  assert.equal(obj.ruleKey, 'sally-sam', "second get works");
  assert.equal(callCount, 1, "second get does not make another call");

  // Change name and transfer cache to invalidate it
  subject.children[0].name = 'liz';
  initCache(obj, subject, obj, dependentKeyMap);

  assert.equal(obj.ruleKey, 'liz-sam', "gets a new value");
  assert.equal(callCount, 2, "getting a new value makes another call");

  // Remove user and transfer cache to invalidate it
  subject.children.pop();
  initCache(obj, subject, obj, dependentKeyMap);

  assert.equal(obj.ruleKey, 'liz', "sam is gone");
  assert.equal(callCount, 3, "getting a new value makes another call");
});

test('Ember [] dependent key parity', function(assert) {
  let obj = {};
  let subject = {
    children: [{ name: 'sally' }, { name: 'sam' }],
  };
  let dependentKeyMap = {
    ruleKey: ['children.[]']
  };
  initCache(obj, subject, undefined, dependentKeyMap);

  let callCount = 0;
  defineMemoizedGetter(obj, 'ruleKey', function() {
    callCount++;
    return subject.children.map((c) => c.name).join('-');
  });

  assert.equal(obj.ruleKey, 'sally-sam', "first get works");
  assert.equal(callCount, 1, "first get results in one call");

  assert.equal(obj.ruleKey, 'sally-sam', "second get works");
  assert.equal(callCount, 1, "second get does not make another call");

  // transfer cache to invalidate it
  initCache(obj, subject, obj, dependentKeyMap);
  subject.children[0].name = 'liz';

  assert.equal(obj.ruleKey, 'sally-sam', "changing a value doesn't invalidate cache");
  assert.equal(callCount, 1, "makes no more calls");
});
