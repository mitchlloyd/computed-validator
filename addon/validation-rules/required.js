import Ember from 'ember';
import { validate } from 'computed-validator';
const { get } = Ember;

export const DEFAULT_MESSAGE = "is required";

export default function required() {
  return validate(function({ subject, key, translate }) {
    if (!get(subject, key)) {
      return translate('validations.required', { property: key });
    }
  });
}
