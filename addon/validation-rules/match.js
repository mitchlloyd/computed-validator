import Ember from 'ember';
import { validate } from 'computed-validator';
const { get } = Ember;

export default function match(regex) {
  return validate(function(subject, key) {
    let value = get(subject, key);
    if (!regex.test(value)) {
      return `must match ${regex.toString()}`;
    }
  });
}
