import { SUBJECT_KEY } from 'computed-validator/validator';

export default function metaAll(...validationRules) {
  return function metaAll_getBlueprint(key) {
    let validationBlueprints = validationRules.map((rule) => rule(key));

    let dependentKeys = validationBlueprints.reduce((accum, blueprint) => {
      return accum.concat(blueprint.dependentKeys);
    }, []);

    let fn = function() {
      return validationBlueprints.reduce((accum, blueprint) => {
        return accum.concat(blueprint.fn.apply(this, this.get(SUBJECT_KEY)));
      }, []);
    };

    return { dependentKeys, fn };
  };
}
