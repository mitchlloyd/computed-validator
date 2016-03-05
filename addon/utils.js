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

export function wrap(fnToWrap, fnWrapper) {
  return function() {
    return fnWrapper(fnToWrap.apply(this, arguments));
  }
}

export function flatMap(array, callback) {
  return array.reduce((accum, item) => {
    return accum.concat(callback(item));
  }, []);
}
