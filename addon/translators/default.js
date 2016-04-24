/**
 * The default translator used to translate error messages.
 * @module
 * @return {function} translate - A function that accepts a translation key and
 * an object containing properties to use for the translation.
 */
export default function defaultTranslator() {
  return function translate(key, properties) {
    let template = getTranslationTemplate(key);

    return template.replace(/\{\{\s*(.*?)\s*\}\}/g, (i, match) => {
      return properties[match];
    });
  };
}

const TRANSLATIONS = {
  // BEGIN-SNIPPET default-translations
  'validations.required': 'is required',
  'validations.in-range': 'must be between {{min}} and {{max}}',
  'validations.in-range.min-only': 'must be at least {{min}}',
  'validations.in-range.max-only': 'must be {{max}} or less',
  'validations.length-in-range': 'length must be between {{min}} and {{max}} characters',
  'validations.length-in-range.min-only': 'length must be at least {{min}} characters',
  'validations.length-in-range.max-only': 'length must be {{max}} or fewer characters',
  'validations.confirmed': 'must match {{keyToMatch}}',
  'validations.exclusion': 'is not an allowed value',
  'validations.integer': 'must be a whole number',
  'validations.match': 'must match {{regex}}',
  'validations.no-match': 'must not match {{regex}}'
  // END-SNIPPET
};

function getTranslationTemplate(key) {
  let template = TRANSLATIONS[key];

  if (!template) {
    throw new Error(`Missing a translation key for: ${key}`);
  }

  return template;
}
