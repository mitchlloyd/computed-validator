import Ember from 'ember';
import { flatten } from 'computed-validator/utils';
const { RSVP } = Ember;

let id = 0;

/**
 * Whenever a validation rule runs, it returns a new ValidationState
 * instance.
 *
 * A ValidationState instance can have pending promises that may return errors
 * in the future. However, a ValidationState will not change when these
 * promises resolve. Rather this module exports `nextValidationState`, a function that
 * will asynchronously retrieve a new validaiton state.
 *
 * @class ValidationState
 * @param {error[]} allErrors - A list of values representing a validation errors
 * @param {function} translate - A function that can translate a validation error
 */
export default class ValidationState {
  constructor({ errors, translate, onUpdate, ancestor }) {
    this.id = ++id;
    this.allErrors = errors;
    this.translate = translate;

    let { pendingErrors, resolvedErrors } = partitionErrors(this.allErrors);
    this.pendingErrors = pendingErrors;
    this.resolvedErrors = resolvedErrors;
    this.translatedErrors = undefined;

    if (onUpdate && this.isValidating) {
      nextValidationState(this).then(onUpdate);
    }

    if (ancestor) {
      this.ancestorId = ancestor.id;
    }
  }

  isUpdateOf(state) {
    return state && this.ancestorId === state.id;
  }

  /**
   * Determine if the validation is valid. This is true if there are no
   * resolved errors and there are no pending promises that may later return
   * errors.
   *
   * @method
   * @return {boolean}
   */
  get isValid() {
    return this.allErrors.length === 0;
  }

  /**
   * A validaion is validating when there is a pending promise that may later
   * return an error.
   *
   * @method
   * @return {boolean}
   */
  get isValidating() {
    return Boolean(this.pendingErrors.length);
  }

  /**
   * Determine if there are any known errors. Keep in mind this is not the same
   * as isValid. A validation may currently have no errors, but could have
   * pending promises that may resolve with errors.
   *
   * @method
   * @return {boolean}
   */
  get hasErrors() {
    return this.resolvedErrors.length > 0;
  }

  /**
   * A convienience method to get the first available error message.
   *
   * @method
   * @return {string}
   */
  get firstError() {
    return this.errors[0] || null;
  }

  /**
   * Get all available error messages.
   *
   * @method
   * @return {string[]}
   */
  get errors() {
    if (!this.translatedErrors) {
      this.translatedErrors = translateErrors(this.resolvedErrors, this.translate);
    }

    return this.translatedErrors;
  }
}

export function nextValidationState(validationState) {
  return RSVP.all(validationState.allErrors).then(flatten).then(errors => {
    return new ValidationState({
      errors,
      translate: validationState.translate,
      ancestor: validationState
    });
  });
}

function partitionErrors(errors) {
  let result = {
    resolvedErrors: [],
    pendingErrors: []
  };

  errors.forEach(error => {
    if (typeof error.then === 'function') {
      result.pendingErrors.push(error);
    } else {
      result.resolvedErrors.push(error);
    }
  });

  return result;
}

function translateErrors(errors, translate) {
  return errors.map(function(error) {
    if (typeof error === 'string') {
      return error;
    } else {
      return translate(error.id, error.properties);
    }
  });
}
