import Ember from 'ember';
import { validate } from 'computed-validator';
const { get } = Ember;
const DEFAULT_MESSAGE = "must be an integer";

export default function required() {
  return validate(function({ subject, key }) {
    let value = get(subject, key);

    if (!value) {
      return DEFAULT_MESSAGE;
    }

    if (!value.toString().trim().match(/^[+-]?\d+$/)) {
      return DEFAULT_MESSAGE;
    }
  });
}
