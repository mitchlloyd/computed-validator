export default function onProperty(attr, validationRule) {
  return function(defaultKey) {
    return validationRule(getAttribute(attr, defaultKey));
  };
}

function getAttribute(attr, defaultKey) {
  if (typeof attr === 'function') {
    return attr(defaultKey);
  } else {
    return attr;
  }
}
