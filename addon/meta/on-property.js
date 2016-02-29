export default function onProperty(attr, validationRule) {
  return function() {
    return validationRule(attr);
  };
}
