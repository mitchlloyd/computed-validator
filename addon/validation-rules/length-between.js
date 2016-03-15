import between from 'computed-validator/validation-rules/between';
import onProperty from 'computed-validator/meta/on-property';
import ValidationError from 'computed-validator/validation-error';
import validationRule from 'computed-validator/validation-rule';

export default validationRule(function([min, max], defaultKey) {
  let message = new ValidationError('validations.length-between', { min, max });
  return onProperty(`${defaultKey}.length`, between(min, max), { message })();
});
