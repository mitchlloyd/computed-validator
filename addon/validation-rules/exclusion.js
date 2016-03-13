import Ember from 'ember';
import { validate } from 'computed-validator';
const { get } = Ember;

export default function exclusion(...forbiddenValues) {
  return validate(function({ subject, key }) {
    let value = get(subject, key);

    if (forbiddenValues.indexOf(value) !== -1) {
      let values = forbiddenValues.join(', ');
      return `cannot be one of: ${values}`;
    }
  });
}
