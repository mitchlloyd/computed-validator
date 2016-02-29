import { validationResult, SUBJECT_KEY } from 'computed-validator/validator';

export default function all(...validationRules) {
  return function(key) {
    let validationBlueprints = validationRules.map(rule => rule(key));

    let dependentKeys = [];
    validationBlueprints.forEach(blueprint => {
      dependentKeys.push(...blueprint.dependentKeys);
    });

    let validationBlueprintFunction = function() {
      let allErrors = [];
      validationBlueprints.forEach((blueprint) => {
        let validationResult = blueprint.fn.apply(this, this.get(SUBJECT_KEY), ...blueprint.dependentKeys);
        allErrors.push(...validationResult.errors);
      });

      return validationResult(allErrors);
    };

    return {
      dependentKeys,
      fn: validationBlueprintFunction
    };
  };
}
