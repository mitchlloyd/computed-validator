// User builds a rule by passing a function
export default function validationRule(build) {

  // User validation declaration with relevant validation arguments
  return function(...args) {
    let messageOption = getMessageOption(args);

    // defineValidator builds the rule, passing the default key
    return function(key) {

      // Execute the build function to return a validation rule blueprint
      let { dependentKeys, validate } = build({ args, key, messageOption });

      return {
        dependentKeys,
        validate(...args) {
          return postProcessErrors(validate(...args));
        }
      }

    };

  };

}

function getMessageOption(args) {
  let lastArg = args[args.length - 1]
  if (lastArg) {
    return lastArg.message;
  }
}

function postProcessErrors(errors, messageOption) {
  if (errors.length && messageOption) {
    return messageOption;
  } else {
    return errors;
  }
}
