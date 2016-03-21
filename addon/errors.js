import ValidationError from 'computed-validator/validation-error';
import { some, every } from 'computed-validator/utils';

export default {
  hasSomeResolved(errors) {
    return some(errors, function(error) {
      return typeof error === 'string' || error instanceof ValidationError;
    });
  },

  allPending(errors) {
    return every(errors, function(error) {
      return typeof error.then === 'function';
    });
  }
}
