return {
  dependentKeys: [key, keyToMatch],
  validate(subject) {
    if (get(subject, key) !== get(subject, keyToMatch)) {
      return [error];
    }
  }
}
