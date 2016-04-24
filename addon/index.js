import {
  defineValidator,
  createValidator,
} from 'computed-validator/validator';
import required from 'computed-validator/validation-rules/required';
import integer from 'computed-validator/validation-rules/integer';
import confirmed from 'computed-validator/validation-rules/confirmed';
import inRange from 'computed-validator/validation-rules/in-range';
import exclusion from 'computed-validator/validation-rules/exclusion';
import lengthInRange from 'computed-validator/validation-rules/length-in-range';
import match from 'computed-validator/validation-rules/match';
import noMatch from 'computed-validator/validation-rules/no-match';
import validate from 'computed-validator/validation-rules/validate';

import computedValidator from 'computed-validator/integrations/ember/computed-validator-macro';

import onProperty from 'computed-validator/meta/on-property';
import all from 'computed-validator/meta/all';
import sequence from 'computed-validator/meta/sequence';
import when from 'computed-validator/meta/when';
import negate from 'computed-validator/meta/negate';

export default computedValidator;
export {
  defineValidator,
  required,
  integer,
  inRange,
  validate,
  confirmed,
  exclusion,
  inRange,
  lengthInRange,
  match,
  noMatch,
  computedValidator,
  onProperty,
  all,
  sequence,
  when,
  negate,
  createValidator
};
