export default function emberI18nTranslator() {
  return function(key, properties) {
    let template = getTranslationTemplate(key);

    return template.replace(/\{\{\s*(.*?)\s*\}\}/g, (i, match) => {
      return properties[match];
    });
  }
}

const TRANSLATIONS = {
  'validations.required': 'is required'
}

function getTranslationTemplate(key) {
  let template = TRANSLATIONS[key];

  if (!template) {
    throw new Error(`Missing a translation key for: ${key}`);
  }

  return template;
}
