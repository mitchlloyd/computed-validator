import ValidationError from 'computed-validator/validation-error';
import Errors from 'computed-validator/errors';

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
  } else if (Errors.isSingleType(errorOrErrors)) {
    return [errorOrErrors];
  } else if (Array.isArray(errorOrErrors)) {
    return errorOrErrors;
  } else {
    throw new Error(`invalid return value from validate: ${errorOrErrors}`);
  }
}

