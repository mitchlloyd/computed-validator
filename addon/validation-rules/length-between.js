import between from 'computed-validator/validation-rules/between';
import onProperty from 'computed-validator/meta/on-property';
import ValidationError from 'computed-validator/validation-error';
import validationRule from 'computed-validator/validation-rule';

export default validationRule(function([min, max], defaultKey) {
  let errorId;
  if (min === -Infinity) {
    errorId = 'validations.length-between.max-only'
  } else if (max === Infinity) {
    errorId = 'validations.length-between.min-only';
  } else {
    errorId = 'validations.length-between';
  }

  let message = new ValidationError(errorId, { min, max });
  return onProperty(`${defaultKey}.length`, between(min, max), { message })();
});
