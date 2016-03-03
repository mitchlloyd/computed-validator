import { validationResult, SUBJECT_KEY } from 'computed-validator/validator';

export default function metaAll(...validationRules) {
  return function metaAll_getBlueprint(key) {
    let validationBlueprints = validationRules.map((rule) => rule(key));

    let dependentKeys = validationBlueprints.reduce((accum, blueprint) => {
      return accum.concat(blueprint.dependentKeys);
    }, []);

    let fn = function() {
      let allErrors = validationBlueprints.reduce((accum, blueprint) => {
        let validationResult = blueprint.fn.apply(this, this.get(SUBJECT_KEY));
        // TODO: Unwrapping validationResult only to make a new one is silly.
        // Move this validationResult wrapping out of validate.
        return accum.concat(validationResult.errors);
      }, []);

      return validationResult(allErrors);
    };

    return { dependentKeys, fn };
  };
}
