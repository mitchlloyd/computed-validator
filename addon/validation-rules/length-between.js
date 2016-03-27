import between from 'computed-validator/validation-rules/between';
import onProperty from 'computed-validator/meta/on-property';
import ValidationError from 'computed-validator/validation-error';
import validationRule from 'computed-validator/validation-rule';

/**
 * Validate that the length of the value is between (inclusive)
 * two integers.
 *
 * @module
 * @public
 * @param {number} min
 * @param {number} max
 * @return {object} validationBlueprint
 */
export default validationRule(function([min, max], defaultKey) {
  let errorId;
  if (min === -Infinity || min === 0) {
    errorId = 'validations.length-between.max-only'
  } else if (max === Infinity) {
    errorId = 'validations.length-between.min-only';
  } else {
    errorId = 'validations.length-between';
  }

  let message = new ValidationError(errorId, { min, max });
  return onProperty(`${defaultKey}.length`, between(min, max, { fallbackValue: 0, message }))();
});
