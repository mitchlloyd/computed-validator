export function every(array, predicate) {
  let index = -1;
  let length = array.length;

  while (++index < length) {
    if (!predicate(array[index], index)) {
      return false;
    }
  }

  return true;
}

export function some(array, predicate) {
  return firstResult(array, predicate) || false;
}

export function flatMap(array, callback) {
  return array.reduce((accum, item) => {
    return accum.concat(callback(item));
  }, []);
}

export function firstResult(array, fn) {
  let index = -1;
  let length = array.length;

  while (++index < length) {
    let result = fn(array[index], index);

    if (result) {
      return result;
    }
  }
}

export function messageOption(args) {
  let lastArg = args[args.length - 1];

  return lastArg && lastArg.message;
}

export function unique(array) {
  let ret = [];

  array.forEach(k => {
    if (ret.indexOf(k) < 0) {
      ret.push(k);
    }
  });

  return ret;
}

export function flatten(array) {
  let result = [];
  let index = -1;

  while (++index < array.length) {
    let value = array[index];
    if (Array.isArray(value)) {
      result.push(...value);
    } else {
      result.push(value);
    }
  }

  return result;
}

export function flow(...fns) {
  return function(...initialArgs) {
    let index = 1;
    let result = fns[0](...initialArgs);

    while (index < fns.length) {
      result = fns[index](result);
      index++;
    }

    return result;
  };
}

// Polyfill from MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
export function assign(target) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  let output = Object(target);
  for (let index = 1; index < arguments.length; index++) {
    let source = arguments[index];
    if (source !== undefined && source !== null) {
      for (let nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
  }

  return output;
}
