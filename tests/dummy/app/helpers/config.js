import Ember from 'ember';
import env from 'dummy/config/environment';

export default Ember.Helper.extend({
  compute([key]) {
    return env[key];
  }
});
