import { every, get } from 'computed-validator/utils';

const CACHE_KEY = '_computed-validator-cache';
const CACHE_REVISION_KEY = '_computed-validator-cache-revision';
const SUBJECT_KEY = '_computed-validator-subject';

// Need this value to keep track of revision in cache without
// holding a reference to a validator.
let guid = 0;

export function isCached(obj, key, dependentKeys) {
  let cacheItem = obj[CACHE_KEY][key];

  if (!cacheItem) {
    return false;
  }

  if (!needsRevalidation(cacheItem, obj)) {
    return true;
  }

  return every(dependentKeys, (dk) => {
    return cacheItem.previousValues[dk] === get(obj, [SUBJECT_KEY, dk]);
  });
}

export function cacheValue(obj, key, dependentKeys, value) {
  let cacheItem = {
    value,
    revision: obj[CACHE_REVISION_KEY],
    previousValues: {},
    transferable: !!dependentKeys.length
  };

  dependentKeys.forEach((k) => {
    cacheItem.previousValues[k] = get(obj, [SUBJECT_KEY, k]);
  });

  obj[CACHE_KEY][key] = cacheItem;

  return value;
}

export function initCache(obj, subject, ancestor) {
  obj[CACHE_KEY] = {};
  obj[SUBJECT_KEY] = subject;
  obj[CACHE_REVISION_KEY] = guid++;

  if (ancestor) {
    transferCache(ancestor[CACHE_KEY], obj[CACHE_KEY]);
  }
}

export function getCache(obj, key) {
  return obj[CACHE_KEY][key].value;
}

function transferCache(prevCache, cache) {
  for (let key in prevCache) {
    if (prevCache[key].transferable) {
      cache[key] = prevCache[key];
    }
  }
}

function needsRevalidation(cache, obj) {
  return cache.revision !== obj[CACHE_REVISION_KEY];
}
