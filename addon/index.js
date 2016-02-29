import defineValidator, {
  validate,
  createValidator,
  SUBJECT_KEY
} from 'computed-validator/validator';
import required from 'computed-validator/validation-rules/required';
import integer from 'computed-validator/validation-rules/integer';
import confirmed from 'computed-validator/validation-rules/confirmed';
import between from 'computed-validator/validation-rules/between';
import exclusion from 'computed-validator/validation-rules/exclusion';

import computedValidator from 'computed-validator/computed-macros/computed-validator';
import onProperty from 'computed-validator/meta/on-property';
import all from 'computed-validator/meta/all';

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
  createValidator,
  SUBJECT_KEY
};
