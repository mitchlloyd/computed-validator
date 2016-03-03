import { validationResult, SUBJECT_KEY } from 'computed-validator/validator';

export default function all(...validationRules) {
  return function(key) {
    let validationBlueprints = validationRules.map((rule) => rule(key));

    let dependentKeys = validationBlueprints.reduce((accum, blueprint) => {
      return accum.concat(blueprint.dependentKeys);
    }, []);

    let fn = function() {
      let allErrors = validationBlueprints.reduce((accum, blueprint) => {
        let validationResult = blueprint.fn.apply(this, this.get(SUBJECT_KEY), ...blueprint.dependentKeys);
        return accum.concat(validationResult.errors);
      }, []);

      return validationResult(allErrors);
    };

    return { dependentKeys, fn };
  };
}
