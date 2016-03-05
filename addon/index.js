import defineValidator, {
  createValidator,
  SUBJECT_KEY
} from 'computed-validator/validator';
import validate from 'computed-validator/validate';
import required from 'computed-validator/validation-rules/required';
import integer from 'computed-validator/validation-rules/integer';
import confirmed from 'computed-validator/validation-rules/confirmed';
import between from 'computed-validator/validation-rules/between';
import exclusion from 'computed-validator/validation-rules/exclusion';

import computedValidator from 'computed-validator/computed-macros/computed-validator';

import onProperty from 'computed-validator/meta/on-property';
import all from 'computed-validator/meta/all';
import sequence from 'computed-validator/meta/sequence';
import when from 'computed-validator/meta/when';

export default defineValidator;
export {
  required,
  integer,
  between,
  validate,
  confirmed,
  exclusion,
  computedValidator,
  onProperty,
  all,
  sequence,
  when,
  createValidator,
  SUBJECT_KEY
};
