import validationRule from 'computed-validator/validation-rule';

/**
 * A flexible validation rule that uses a function to validate
 * values on the subject.
 *
 * @module
 * @public
 * @param {...string} dependentKeys - Dependent keys to determine when to rerun
 * the validation.  property identified by the validation key
 * @param {function} validate - A function that returns a validation error when
 * the property is not valid.
 * @return {object} validationBlueprint
 */
export default validationRule(function([dependentKeys, validate], { onProperty }) {
  // Normal arg case:
  // [], fn, {}
  //
  // Also handle implicit dependent keys
  // fn, {}
  //
  if (!validate) {
    validate = dependentKeys;
    dependentKeys = [onProperty];
  }

  // Turn single dependent keys into an array
  if (typeof dependentKeys === 'string') {
    dependentKeys = [dependentKeys];
  }

  return { dependentKeys, validate };
});
