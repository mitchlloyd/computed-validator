import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('quick-start');
  this.route('included-validation-rules');
  this.route('meta-validation-rules');
  this.route('rule-options');
  this.route('creating-validation-rules');
  this.route('i18n');
  this.route('async');
});

export default Router;
