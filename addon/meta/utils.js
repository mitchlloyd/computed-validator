export function metaBlueprintFor(validationRules, key) {
  let allDependentKeys = [];
  let validateFunctions = [];

  validationRules.forEach((rule) => {
    let { dependentKeys, validate } = rule(key);
    allDependentKeys.push(...dependentKeys);
    validateFunctions.push(validate);
  });

  return {
    dependentKeys: allDependentKeys,
    validateFunctions
  };
}
