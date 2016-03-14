// User builds a rule by passing a function
export default function validationRule(build) {

  // User validation declaration with relevant validation arguments
  return function(...args) {

    // Validator builds the rule, passing the default key
    return function(key) {

      // Execute the build function to return a validation rule blueprint
      return build({ args, key });

    };

  };

}
