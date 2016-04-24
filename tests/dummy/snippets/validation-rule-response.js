return {
  dependentKeys: [onProperty, keyToMatch],
  validate(subject) {
    if (get(subject, onProperty) !== get(subject, keyToMatch)) {
      return error;
    }
  }
};
