import { every } from 'computed-validator/utils';
import Ember from 'ember';
const { get } = Ember;

const PRIVATE = '_computed-validator-cache';

// Need this value to keep track of revision in cache without
// holding a reference to a validator.
let guid = 0;

export function isCached(obj, key) {
  let privateProps = obj[PRIVATE];
  let cacheItem = privateProps.cache[key];
  let dependentKeys = privateProps.dependentKeyMap[key] || [];

  if (!cacheItem) {
    return false;
  }

  if (!needsRevalidation(cacheItem, obj)) {
    return true;
  }

  let subject = privateProps.subject;
  return every(dependentKeys, (dk) => {
    return cacheItem.previousValues[dk] === get(subject, dk);
  });
}

export function cacheValue(obj, key, value) {
  let privateProps = obj[PRIVATE];
  let dependentKeys = privateProps.dependentKeyMap[key] || [];

  let cacheItem = {
    value,
    revision: privateProps.revision,
    previousValues: {},
    transferable: !!dependentKeys.length
  };

  let subject = privateProps.subject;
  dependentKeys.forEach((k) => {
    cacheItem.previousValues[k] = get(subject, k);
  });

  privateProps.cache[key] = cacheItem;

  return value;
}

export function initCache(obj, subject, ancestor, dependentKeyMap) {
  obj[PRIVATE] = {
    cache: {},
    subject,
    revision: guid++,
    dependentKeyMap: dependentKeyMap || {}
  };

  if (ancestor) {
    transferCache(ancestor[PRIVATE].cache, obj[PRIVATE].cache);
  }
}

export function getCache(obj, key) {
  return obj[PRIVATE].cache[key].value;
}

function transferCache(prevCache, cache) {
  for (let key in prevCache) {
    if (prevCache[key].transferable) {
      cache[key] = prevCache[key];
    }
  }
}

function needsRevalidation(cache, obj) {
  return cache.revision !== obj[PRIVATE].revision;
}
