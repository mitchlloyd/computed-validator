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
