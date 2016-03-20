import Ember from 'ember';
import { metaBlueprintFor } from './utils';
import validationRule from 'computed-validator/validation-rule';
import { firstResult, last } from 'computed-validator/utils';
import ValidationError from 'computed-validator/validation-error';
import Errors from 'computed-validator/errors';
const { RSVP } = Ember;

export default validationRule(function(args, key) {
  let { dependentKeys, validateFunctions } = metaBlueprintFor(args, key);

  let validate = function(subject) {
    return getNextErrorResult(subject, validateFunctions);
  };

  return { dependentKeys, validate };
});

/*
  If there are any errors returned from a validation in sequence we don't have
  to worry about any validations after that. However, if all the validation
  errors from a validation are promises, then it might later resolve to no
  errors. In that case we chain the remaining validation calls onto that
  promise so they can be evaluated when that promise resolves.


  [ValidationError, Promise]

  In this case there is already a known error, so we can return the errors, knowing
  that we won't have to evaluate the next result.


  [Promise, ValidationError]

  In this case we can just return the errors. The first error in the sequence may
  change to the Promise result, but we know that there is nothing that needs to be
  evaluated after the known ValidationError.


  [Promise, Promise]

  This is the case we need to handle the cast where each Promise returns no
  errors. Here we'll chain the next validations onto the last Promise for evaluation
  after that promise has resolved.
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
      let lastPromise = errors.pop().then((errors) => {
        if (errors.length) {
          return errors;
        } else {
          return getNextErrorResult(subject, validateFunctions.slice(i + 1));
        }
      });
      errors.push(lastPromise);
      return errors;
    }
  }) || [];
}

