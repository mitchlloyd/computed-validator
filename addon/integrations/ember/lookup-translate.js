import defaultTranslator from 'computed-validator/translators/default';
import emberI18nTranslator from 'computed-validator/translators/ember-i18n';
import { firstResult } from 'computed-validator/utils';
const translators = [emberI18nTranslator, defaultTranslator]

/**
 * This function returns a function that translates error messages.
 *
 * 1. If there is no owner, we'll use this library's default translator.
 * 2. We'll look for a user-defined 'computed-validator-translation' service
 *    and use the `translate` method defined there.
 * 3. Finally we'll loop through all magic translator adapters to get a translate
 *    function from the owner.
 *
 * @private
 * @module
 * @param {Object} [owner] - An Ember application instance
 * @return {function} translate - A function that accepts an object like `{ id:
 * translationKey, properties { some: prop } }` and returns a translated string.
 */
export default function lookupTranslate(owner) {
  if (!owner) {
    return defaultTranslator();
  }

  let userDefinedService = owner.lookup('service:computed-validator-translation');

  if (userDefinedService) {
    return userDefinedService.translate.bind(service);
  } else {
    return firstResult(translators, (translator) => translator(owner));
  }
}
