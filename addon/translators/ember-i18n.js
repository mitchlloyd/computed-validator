/**
 * A translator that interfaces with [ember-i18n](https://github.com/jamesarosen/ember-i18n)
 *
 * @module
 * @return {function} translate - A function that accepts a translation key and
 * an object containing properties to use for the translation.
 */
export default function emberI18nTranslator(app) {
  let service = app.lookup('service:i18n');

  if (service) {
    return function(...args) {
      return service.t(...args);
    };
  }
}
