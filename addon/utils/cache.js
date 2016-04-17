import {
  CACHE_KEY,
  SUBJECT_KEY,
  ID_KEY
} from 'computed-validator/validator/private-keys';
import { every } from 'computed-validator/utils';

// Need this value to keep track of revision in cache without
// holding a reference to a validator.
let guid = 0;

export function isCached(obj, key, dependentKeys) {
  let cache = obj[CACHE_KEY][key];

  if (!cache) {
    return false;
  }

  if (!needsRevalidation(cache, obj)) {
    return true;
  }

  return every(dependentKeys, (dk) => {
    return cache.previousValues[dk] === obj[SUBJECT_KEY][dk];
  });
}

export function cacheValue(obj, key, dependentKeys, value) {
  let previousValues = {};
  let subject = obj[SUBJECT_KEY];

  dependentKeys.forEach((k) => {
    previousValues[k] = subject[k];
  });

  return (
    obj[CACHE_KEY][key] = {
      value,
      revision: obj[ID_KEY],
      previousValues
    }
  ).value;
}

export function initCache(obj) {
  obj[CACHE_KEY] = {};
  obj[ID_KEY] = guid++;
}

export function getCache(obj, key) {
  return obj[CACHE_KEY][key].value;
}

export function transferCache(prevObj, obj) {
  if (!prevObj) {
    return;
  }

  for (let key in prevObj[CACHE_KEY]) {
    obj[CACHE_KEY][key] = prevObj[CACHE_KEY][key];
  }
}

function needsRevalidation(cache, obj) {
  return cache.revision !== obj[ID_KEY];
}
