import ValidationError from 'computed-validator/validation-error';

export default function(...args) {
  let fn = args.pop();
  let dependentKeys = args;

  let validate = function(...args) {
    return normalizeErrorsResult(fn.apply(this, args));
  }
  return { dependentKeys, validate };
}

function normalizeErrorsResult(errorOrErrors) {
  if (!errorOrErrors) {
    return [];
  } else if (isValidSingleErrorType(errorOrErrors)) {
    return [errorOrErrors];
  } else if (Array.isArray(errorOrErrors)) {
    return errorOrErrors;
  } else {
    throw new Error(`invalid return value from validate: ${errorOrErrors}`);
  }
}

function isValidSingleErrorType(error) {
  return typeof error === 'string' ||
         error instanceof ValidationError ||
         typeof error.then === 'function'
}
