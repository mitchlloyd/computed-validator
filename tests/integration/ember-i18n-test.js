import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import { computedValidator, required } from 'computed-validator';
const { inject } = Ember;

moduleForComponent('x-component', 'Integration | Component | ember i18n', {
  integration: true
});

test('using translations from ember-i18n', function(assert) {
  const Component = Ember.Component.extend({
    i18n: inject.service(),

    validator: computedValidator('user', {
      name: required()
    }),

    init() {
      this._super(...arguments);
      this.get('i18n').addTranslations('en', {
        'validations.required': 'custom is required: {{property}}'
      });
    },

    layout: hbs`
      {{validator.name.firstError}}
    `
  });

  this.register('component:ember-i18n', Component);

  this.set('user', { name: null });
  this.render(hbs`{{ember-i18n user=user}}`);

  assert.equal(this.$().text().trim(), 'custom is required: name');
});
