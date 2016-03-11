export default function emberI18nTranslator() {
  return function(key, properties) {
    let template = TRANSLATIONS[key];
    return template.replace(/\{\{\s*(.*?)\s*\}\}/g, (i, match) => {
      return properties[match];
    });
  }
}

const TRANSLATIONS = {
  'validations.required': 'is required'
}
