import Ember from 'ember';
import { validate } from 'computed-validator';
const { get } = Ember;

export const DEFAULT_MESSAGE = "is required";

export default function required() {
  return validate(function(subject, key) {
    if (!get(subject, key)) {
      return DEFAULT_MESSAGE;
    }
  });
}
