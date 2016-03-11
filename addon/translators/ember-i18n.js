export default function emberI18nTranslator(app) {
  let service = app.lookup('service:i18n');

  if (service) {
    return function(...args) {
      return service.t(...args);
    }
  }
}
