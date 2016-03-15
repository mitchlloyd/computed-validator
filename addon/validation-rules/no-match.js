import negate from 'computed-validator/meta/negate';
import match from 'computed-validator/validation-rules/match';
import validationRule from 'computed-validator/validation-rule';
import ValidationError from 'computed-validator/validation-error';

export default validationRule(function([regex], key) {
  let message = new ValidationError('validations.no-match', { property: key, regex });
  return negate(match(regex), { message })(key);
})
