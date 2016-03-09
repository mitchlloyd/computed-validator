import negate from 'computed-validator/meta/negate';
import match from 'computed-validator/validation-rules/match';

export default function noMatch(regex) {
  return negate(match(regex), { message: `Must not match ${regex.toString()}` });
}
