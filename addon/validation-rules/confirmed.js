import Ember from 'ember';
import { validate } from 'computed-validator';
const { get } = Ember;

export default function confirmed(keyToMatch) {
  return validate((attr) => [attr, keyToMatch], function({ subject, key }) {
    if (get(subject, key) !== get(subject, keyToMatch)) {
      return `must match ${keyToMatch}`;
    }
  });
}
