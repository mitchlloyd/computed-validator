export default function emberI18nTranslator() {
  return function(key, properties) {
    let template = getTranslationTemplate(key);

    return template.replace(/\{\{\s*(.*?)\s*\}\}/g, (i, match) => {
      return properties[match];
    });
  }
}

const TRANSLATIONS = {
  'validations.required': 'is required',
  'validations.between': 'must be between {{min}} and {{max}}',
  'validations.between.min-only': 'must be at least {{min}}',
  'validations.between.max-only': 'must be {{max}} or less',
  'validations.length-between': 'length must be between {{min}} and {{max}}'
}

function getTranslationTemplate(key) {
  let template = TRANSLATIONS[key];

  if (!template) {
    throw new Error(`Missing a translation key for: ${key}`);
  }

  return template;
}
