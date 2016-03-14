export function metaBlueprintFor(validationRules, key) {
  let dependentKeys = [];
  let validateFunctions = [];

  validationRules.forEach((rule) => {
    let { dependentKeys, validate } = rule(key);
    dependentKeys.push(...dependentKeys);
    validateFunctions.push(validate);
  });

  return { dependentKeys, validateFunctions };
}
