import Ember from 'ember';
import { assign, flatten } from 'computed-validator/utils';
const { RSVP } = Ember;

export default class ValidationState {
  constructor(allErrors, translate) {
    this.allErrors = allErrors;
    this.translate = translate;

    let { pendingErrors, resolvedErrors } = partitionErrors(allErrors);
    this.pendingErrors = pendingErrors;
    this.resolvedErrors = resolvedErrors;
    this.translatedErrors = undefined;
  }

  get isValid() {
    return !this.hasErrors;
  }

  get isValidating() {
    return !!this.pendingErrors.length;
  }

  get hasErrors() {
    return this.allErrors.length > 0;
  }

  get firstError() {
    return this.errors[0] || null;
  }

  get errors() {
    if (!this.translatedErrors) {
      this.translatedErrors = translateErrors(this.resolvedErrors, this.translate);
    }
    return this.translatedErrors;
  }
}

export function nextValidationState(validationState) {
  return RSVP.all(validationState.allErrors).then(flatten).then((errors) => {
    return new ValidationState(errors, validationState.translate);
  });
}

function partitionErrors(errors) {
  let result = {
    resolvedErrors: [],
    pendingErrors: []
  }

  errors.forEach((error, i) => {
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
