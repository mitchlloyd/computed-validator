import between from 'computed-validator/validation-rules/between';
import onProperty from 'computed-validator/meta/on-property';
import ValidationError from 'computed-validator/validation-error';
import { messageOption } from 'computed-validator/utils';

export default function lengthBetween(min, max) {
  let message = messageOption(arguments) ||
    new ValidationError('validations.length-between', { min, max });

  return onProperty((key) => `${key}.length`, between(min, max), { message });
}
