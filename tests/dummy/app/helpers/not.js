import Ember from 'ember';

export default Ember.Helper.helper(function([boolean]) {
  return !boolean;
})
