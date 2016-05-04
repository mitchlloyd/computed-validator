import { every, some } from 'computed-validator/utils';
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
    return !cacheItem.previousDependencyValues[dk].hasChanged(subject);
  });
}

export function cacheValue(obj, key, value) {
  let privateProps = obj[PRIVATE];
  let dependentKeys = privateProps.dependentKeyMap[key] || [];

  let cacheItem = {
    value,
    revision: privateProps.revision,
    previousDependencyValues: {},
    transferable: !!dependentKeys.length
  };

  let subject = privateProps.subject;
  dependentKeys.forEach((k) => {
    cacheItem.previousDependencyValues[k] = getDependencyValue(subject, k);
  });

  privateProps.cache[key] = cacheItem;

  return value;
}

export function initCache(obj, subject, ancestor, dependentKeyMap) {
  let nextCache = {};

  if (ancestor) {
    transferCache(ancestor[PRIVATE].cache, nextCache);
  }

  obj[PRIVATE] = {
    cache: nextCache,
    subject,
    revision: guid++,
    dependentKeyMap: dependentKeyMap || {}
  };
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

function getDependencyValue(subject, path) {
  // Try to split by @each or [] to see if either is in the path
  let paths = path.split('@each');
  if (paths.length === 1) {
    paths = path.split('[]');
  }

  if (paths.length === 2) {
    let [firstPath, mapPath] = paths;
    return new ArrayDependencyValue(subject, firstPath, mapPath);
  } else if (paths.length === 1) {
    return new IdentityDependencyValue(subject, paths[0]);
  } else {
    throw new Error(`invalid path for dependent key: ${path}`);
  }
}

class ArrayDependencyValue {
  constructor(subject, path, mapPath) {
    this.path = path;
    this.mapPath = mapPath;

    let array = get(subject, path);
    if (mapPath.length) {
      array = array.map((item) => get(item, mapPath));
    }
    this.array = array;
  }

  hasChanged(otherSubject) {
    let otherArray = get(otherSubject, this.path);

    if (!Array.isArray(otherArray)) {
      return true;
    }

    if (otherArray.length !== this.array.length) {
      return true;
    }

    return some(otherArray, (item, i) => {
      return item !== this.array[i];
    });
  }
}

class IdentityDependencyValue {
  constructor(subject, path) {
    this.path = path;
    this.value = get(subject, path);
  }

  hasChanged(otherSubject) {
    return this.value !== get(otherSubject, this.path);
  }
}
