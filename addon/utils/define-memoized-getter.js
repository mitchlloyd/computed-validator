import {
  isCached,
  cacheValue,
  peekCache
} from 'computed-validator/utils/cache';

export default function defineMemoizedGetter(klass, key, fn) {
  Object.defineProperty(klass.prototype, key, {
    get: memoizedGetter(key, fn),
    configurable: false,
    enumerable: true
  });
}

function memoizedGetter(key, fn) {
  return function memoizedGetterFunciton() {
    if (isCached(this, key)) {
      return peekCache(this, key);
    }

    return cacheValue(this, key, fn.call(this));
  };
}
