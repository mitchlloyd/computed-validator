import {
  isCached,
  cacheValue,
  getCache
} from 'computed-validator/utils/cache';

export default function defineMemoizedGetter(object, key, fn) {
  Object.defineProperty(object, key, {
    get: memoizedGetter(key, fn),
    configurable: false,
    enumerable: true
  });
}

function memoizedGetter(cacheKey, fn) {
  return function memoizedGetterImplementation() {
    if (isCached(this, cacheKey)) {
      return getCache(this, cacheKey);
    }

    return cacheValue(this, cacheKey, fn.call(this));
  };
}
