import Ember from 'ember';
import { validate } from 'computed-validator';
const { get } = Ember;

export default function required() {
  return validate(function(subject, key) {
    let value = get(subject, key);

    if (!value.toString().trim().match(/^[+-]?\d+$/)) {
      return "must be an integer";
    }
  });
}
