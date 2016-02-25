import Ember from 'ember';
import { validate } from 'computed-validator';
const { get } = Ember;

export default function between(min, max) {
  return validate((attr) => [attr], function(subject, key) {
    let value = get(subject, key);

    if (value >= max) {
      return `must be less than or equal to ${max}`;
    } else if (value <= min) {
      return `must be greater than or equal to ${min}`;
    }
  });
}
