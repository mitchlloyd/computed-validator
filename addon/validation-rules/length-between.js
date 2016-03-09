import between from 'computed-validator/validation-rules/between';
import onProperty from 'computed-validator/meta/on-property';

export default function lengthBetween(min, max) {
  return onProperty((key) => `${key}.length`, between(min, max));
}
