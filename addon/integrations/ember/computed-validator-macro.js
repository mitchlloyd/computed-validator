import Ember from 'ember';
import { defineValidator, SUBJECT_KEY } from 'computed-validator';
import { OWNER_KEY } from 'computed-validator/integrations/ember/validator';
import { CONTEXT_KEY } from 'computed-validator/validator/private-keys';
const { computed, getOwner } = Ember;

/**
 * This is the primary interface for using Computed Validator. When used from an
 * Ember "looked up" object, it given Computed Validator a chance to access the
 * container so that it can integrate with translation services.
 *
 * @param {string} subjectKey - A key used to find the subject on the context
 * @param {object} rules - A set of key-value pairs that are used to define a
 * validator class
 */
export default function(subjectKey, rules) {
  let Validator = defineValidator(rules);

  return computed(subjectKey, function() {
    let subject = this.get(subjectKey);

    if (!subject) {
      return;
    }

    return Validator.create({
      [SUBJECT_KEY]: this.get(subjectKey),
      [OWNER_KEY]: getOwner(this),
      [CONTEXT_KEY]: this
    });
  });
}
