import {
  isCached,
  cacheValue,
  getCache
} from 'computed-validator/utils/cache';

export default function defineMemoizedGetter(object, key, dependentKeys, fn) {
  Object.defineProperty(object, key, {
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
