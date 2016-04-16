import { CACHE_KEY } from 'computed-validator/validator/private-keys';

export function isCached(obj, key) {
  return key in obj[CACHE_KEY];
}

export function cacheValue(obj, key, value) {
  return obj[CACHE_KEY][key] = value;
}

export function initCache(obj) {
  obj[CACHE_KEY] = {};
}

export function peekCache(obj, key) {
  return obj[CACHE_KEY][key];
}
