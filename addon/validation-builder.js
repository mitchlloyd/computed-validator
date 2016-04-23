import Ember from 'ember';
import { flow, assign } from 'computed-validator/utils';
import Errors from 'computed-validator/errors';
const { get } = Ember;

export default class ValidationBuilder {
  constructor(buildFn, args) {
    this.buildFn = buildFn;
    this.args = args;
    this.options = {};
  }

  onProperty(key) {
    if (!this.options.onProperty) {
      this.options.onProperty = key;
    }
    return this;
  }

  message(message) {
    this.options.message = message;
    return this;
  }

  when(key) {
    this.options.when = key;
    return this;
  }

  assign(options) {
    assign(this.options, options);
    return this;
  }

  build() {
    let blueprint = this.buildFn(this.args, this.options);

    // Wrap the validate function to get predicatable error results
    blueprint.validate = flow(blueprint.validate, normalizeErrors);

    blueprint = handleMessageOption(blueprint, this.options);
    blueprint = handleWhenOption(blueprint, this.options);
    return blueprint;
  }
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
}

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

function normalizeErrors(errorOrErrors) {
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

