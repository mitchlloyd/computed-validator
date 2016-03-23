export default function defaultTranslator() {
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
  'validations.length-between': 'length must be between {{min}} and {{max}} characters',
  'validations.length-between.min-only': 'length must be at least {{min}} characters',
  'validations.length-between.max-only': 'length must be {{max}} or fewer characters',
  'validations.confirmed': 'must match {{keyToMatch}}',
  'validations.exclusion': 'is not an allowed value',
  'validations.integer': 'must be a whole number',
  'validations.match': 'must match {{regex}}',
  'validations.no-match': 'must not match {{regex}}'
}

function getTranslationTemplate(key) {
  let template = TRANSLATIONS[key];

  if (!template) {
    throw new Error(`Missing a translation key for: ${key}`);
  }

  return template;
}
