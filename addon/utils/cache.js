import { every, get } from 'computed-validator/utils';

const CACHE_KEY = '_computed-validator-cache';
const DEPENDENT_KEY = '_computed-validator-dependent-key';
const CACHE_ID_KEY = '_computed-validator-cache-id';

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
    return cacheItem.previousValues[dk] === get(obj, [obj[DEPENDENT_KEY], dk]);
  });
}

export function cacheValue(obj, key, dependentKeys, value) {
  let cacheItem = {
    value,
    revision: obj[CACHE_ID_KEY],
    previousValues: {},
    transferable: !!dependentKeys.length
  };

  dependentKeys.forEach((k) => {
    cacheItem.previousValues[k] = get(obj, [obj[DEPENDENT_KEY], k]);
  });

  obj[CACHE_KEY][key] = cacheItem;

  return value;
}

export function initCache(obj, dependentKey, ancestor) {
  obj[CACHE_KEY] = {};
  obj[DEPENDENT_KEY] = dependentKey;
  obj[CACHE_ID_KEY] = guid++;
  transferCache(ancestor, obj);
}

export function getCache(obj, key) {
  return obj[CACHE_KEY][key].value;
}

function transferCache(prevObj, obj) {
  if (!prevObj) {
    return;
  }

  let objCache = obj[CACHE_KEY];
  let prevCache = prevObj[CACHE_KEY];

  for (let key in prevCache) {
    if (prevCache[key].transferable) {
      objCache[key] = prevCache[key];
    }
  }
}

function needsRevalidation(cache, obj) {
  return cache.revision !== obj[CACHE_ID_KEY];
}
