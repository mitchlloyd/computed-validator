import negate from 'computed-validator/meta/negate';
import match from 'computed-validator/validation-rules/match';
import validationRule from 'computed-validator/validation-rule';
import ValidationError from 'computed-validator/validation-error';

/**
 * Validate that a given value does not match a given regular expression.
 *
 * @module
 * @public
 * @param {string} regex - Regular expression to match
 * @return {object} validationBuilder
 */
export default validationRule(function([regex], { onProperty }) {
  let message = new ValidationError('validations.no-match', { property: onProperty, regex });

  return negate(match(regex)).assign({ message, onProperty }).build();
});
