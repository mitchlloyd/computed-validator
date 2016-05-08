import { metaBlueprintFor } from './utils';
import validationRule from 'computed-validator/validation-rule';
import { firstResult } from 'computed-validator/utils';
import Errors from 'computed-validator/errors';

/**
 * This rule takes a list of validation rules and returns a new rule that executes
 * each validation rule in order. One might use this rule for two reasons:
 *
 * 1) To specify the exact order to present validation rules.
 *
 * For instance if someone's password is required and must be complex we could
 * use sequence like this:
 *
 *     sequence(required(), complexity())
 *
 * This would allow us to show the "required" message first and then show a list of
 * complexity messages next by just using the `validator.name.errors` path.
 *
 * 2) To postpone long-running, asynchronous validations.
 *
 * A case for this might be picking a username where we want to check the
 * length first and then, only after that requirement has been met, check with
 * the server to see if that username has been taken.
 *
 *     sequence(required(), lengthInRange(5, 25), uniqueness())
 *
 * @module
 * @public
 * @param {ValidationBlueprint[]} rules - A list of validation rules to exectue in sequence
 * @return {object} validationBuilder
 */
export default validationRule(function(rules, { onProperty }) {
  let { dependentKeys, validateFunctions } = metaBlueprintFor(rules, onProperty);

  let validate = function(subject) {
    return getNextErrorResult(subject, validateFunctions);
  };

  return { dependentKeys, validate };
});

/*
  If there are any synchronous errors returned from a validation in sequence we
  don't have to worry about any validations after that. However, if all the
  validation errors from a validation are promises, then it might later resolve
  to an empty set of errors. In that case we chain the remaining validation
  calls onto the last promise so they can be evaluated if that promise
  resolves with no errors.

  Examples:

  [validationError, promise] - In this case there is already a known error, so
  we can return the errors, knowing that we won't have to evaluate the next
  result.

  [promise, validationError] - In this case we can just return the errors. The
  first error in the sequence may change to the Promise result, but we know
  that there is nothing that needs to be evaluated after the known
  ValidationError.

  [promise, promise] - Here we need to handle the case where each Promise
  returns no errors.
*/
function getNextErrorResult(subject, validateFunctions) {
  return firstResult(validateFunctions, function(fn, i) {
    let errors = fn(subject);

    // No errors, so check the next result
    if (!errors.length) {
      return;
    }

    // Because there is at least one resolved error, we don't have to evaluate
    // the next validaton rule.
    if (Errors.hasSomeResolved(errors)) {
      return errors;
    }

    // We might end up with no errors, so we chain the remaining valiation
    // rules onto the last promise.
    if (Errors.allPending(errors)) {
      let lastPromise = errors.pop().then(resolvedErrors => {
        if (resolvedErrors.length) {
          return resolvedErrors;
        } else {
          return getNextErrorResult(subject, validateFunctions.slice(i + 1));
        }
      });
      errors.push(lastPromise);

      return errors;
    }
  }) || [];
}
