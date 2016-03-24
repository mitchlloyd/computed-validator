import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import {
  computedValidator,
  validate
} from 'computed-validator';
const { get } = Ember;

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.user = {
      groups: Ember.A()
    };
  },

  actions: {
    changeGroup(event) {
      let groupId = event.currentTarget.value
      let checked = event.currentTarget.checked

      if (checked) {
        this.user.groups.pushObject(groupId);
      } else {
        this.user.groups.removeObject(groupId);
      }
    }
  },

  layout: hbs`
    <label class="m-r-1">
      <input type="checkbox" onchange={{action 'changeGroup'}} value="1" />
      Group 1
    </label>
    <label class="m-r-1">
      <input type="checkbox" onchange={{action 'changeGroup'}} value="2" />
      Group 2
    </label>
    <label>
      <input type="checkbox" onchange={{action 'changeGroup'}} value="3" />
      Group 3
    </label>

    <p class="field-errors">{{validator.groupCount.errors}}</p>
  `,

  // BEGIN-SNIPPET required-example-validator
  validator: computedValidator('user', {
    groupCount: validate('groups.length', function(subject) {
      if (get(subject, 'groups.length') !== 2) {
        return "select exactly 2 groups";
      };
    })
  })
  // END-SNIPPET
});

