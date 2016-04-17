import {
  isCached,
  cacheValue,
  getCache
} from 'computed-validator/utils/cache';

export default function defineMemoizedGetter(klass, key, dependentKeys, fn) {
  Object.defineProperty(klass.prototype, key, {
    get: memoizedGetter(key, dependentKeys, fn),
    configurable: false,
    enumerable: true
  });
}

function memoizedGetter(cacheKey, dependentKeys, fn) {
  return function memoizedGetterFunciton() {
    if (isCached(this, cacheKey, dependentKeys)) {
      return getCache(this, cacheKey);
    }

    return cacheValue(this, cacheKey, dependentKeys, fn.call(this));
  };
}
