import Ember from 'ember';

export default Ember.Helper.helper(function([array]) {
  return array.join(', ');
})
