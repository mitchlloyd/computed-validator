import Ember from 'ember';
const { get } = Ember;

// User builds a rule by passing a function
export default function validationRule(build) {

  // User validation declaration with relevant validation arguments
  return function(...args) {

    // defineValidator builds the rule, passing the default key
    return function(key) {

      // Execute the build function to return a validation rule blueprint
      let blueprint = build(args, key);
      let options = optionsFor(args)

      blueprint = handleMessageOption(blueprint, options);
      blueprint = handleWhenOption(blueprint, options);
      return blueprint;
    };

  };

}

function handleMessageOption({ dependentKeys, validate }, options) {
  let message = options.message;

  if (!message) {
    return arguments[0];
  }

  return {
    dependentKeys,

    validate(...args) {
      if (validate(...args).length) {
        return [getMessage(message, this)];
      } else {
        return [];
      }
    }
  };
};

function getMessage(message, context) {
  if (typeof message === 'function') {
    return message(context);
  } else {
    return message;
  }
}

function handleWhenOption({ dependentKeys, validate }, options) {
  let whenKey = options.when;

  if (!whenKey) {
    return arguments[0];
  }

  dependentKeys.push(whenKey);

  return {
    dependentKeys,

    validate(subject) {
      if (get(subject, whenKey)) {
        return validate(subject);
      } else {
        return [];
      }
    }
  };
}

function optionsFor(args) {
  let lastArg = args[args.length - 1]

  if (typeof lastArg === 'object') {
    return lastArg;
  } else {
    return {};
  }
}
