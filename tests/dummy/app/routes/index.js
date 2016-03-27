import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    this.transitionTo('quick-start');
  }
});
