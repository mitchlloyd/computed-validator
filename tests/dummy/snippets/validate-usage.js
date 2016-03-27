return validate(key, keyToMatch, function(subject) {
  if (get(subject, key) !== get(subject, keyToMatch)) {
    return error;
  }
});
