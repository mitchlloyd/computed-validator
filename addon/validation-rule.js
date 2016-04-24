import ValidationBuilder from 'computed-validator/validation-builder';

/**
 * A function used to create validation rules.
 *
 * @module
 * @public
 * @param {function} build - A function that returns a validation blueprint
 * @return {function} validationRule - A function that accepts validation rule
 * arguments and returns a validationBuilder
 */
export default function validationRule(build) {

  // User validation declaration with relevant validation arguments
  return function(...args) {

    // Return an object to update args
    return new ValidationBuilder(build, args);

  };

}
