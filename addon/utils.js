export function every(array, predicate) {
  let index = -1;
  let length = array.length;

  while (++index < length) {
    if (!predicate(array[index])) {
      return false;
    }
  }
  return true;
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
    let result = fn(array[index]);

    if (result) {
      return result;
    }
  }
}
