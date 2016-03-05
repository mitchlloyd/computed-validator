export function metaBlueprintFor(validationRules, key) {
  let dependentKeys = [];
  let fns = [];

  validationRules.forEach((rule) => {
    let { dependentKeys, fn } = rule(key);
    dependentKeys.push(...dependentKeys);
    fns.push(fn);
  });

  return { dependentKeys, fns };
}
