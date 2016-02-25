import Ember from 'ember';
import { validate } from 'computed-validator';
const { get } = Ember;

export default function required() {
  return validate(function(subject, key) {
    if (!get(subject, key)) {
      return "is required";
    }
  });
}
