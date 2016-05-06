import Ember from 'ember';
import { defineValidator } from 'computed-validator';
import lookupTranslate from 'computed-validator/integrations/ember/lookup-translate';
const { computed, getOwner } = Ember;

/**
 * This is the primary interface for using Computed Validator. When used from an
 * Ember "looked up" object, it gives Computed Validator a chance to access the
 * container so that it can integrate with translation services.
 *
 * @public
 * @param {string} subjectKey - A key used to find the subject on the context
 * @param {object} rules - A set of key-value pairs that are used to define a
 * validator class
 * @module
 */
export default function(subjectKey, rules) {
  let Validator = defineValidator(rules);

  return computed(subjectKey, function() {
    let subject = this.get(subjectKey);

    if (!subject) {
      return;
    }

    return new Validator({
      subject,
      translate: lookupTranslate(getOwner(this)),
      context: this
    });
  });
}
