# Computed Validator

Validate objects.

[![Circle CI](https://circleci.com/gh/mitchlloyd/computed-validator.svg?style=shield)](https://circleci.com/gh/mitchlloyd/computed-validator)

**Be aware that this Addon is brand new! Feel free to run it through it's paces and help by reporting issues.**

## Installation

```
ember install computed-validator
```

## Usage

Ember Computed Validator provides an interface on top of Ember's computed
properties to validate objects.

```javascript
export default Ember.Component.extend({
  validator: computedValidator('user', {
    name: required()
  });
});
```

In your template you can use properties from the validator. This example uses
ember-truth-helpers to add the `not` helper.

```hbs
{{input value=user.name class=(if validator.name.hasErrors 'has-error')}}

<div class="error">
  {{validator.name.firstError}}
</div>

<button disabled={{not validator.isValid}}>Submit</button>
```

Most likely, you'll develop components that manage the display of validation
errors to create the UI that you want. Keep in mind that your validator will
always tell the truth about whether you object is valid. Your field components
should manage how and when errors are shown to users.

When creating these types of components you can pass individual
validations to get the validation information you need:

```hbs
{{validated-field value=user.name validation=validator.name}}
```

For bonus points implement a validated form component and pass the entire
validator in.

```hbs
{{#validated-form model=user validator=validator as |form|}}
  {{form.text-field 'name'}}
{{/validated-form}}
```

## Composing Validations

Computed Validator uses functions to define which validation rules to run
and how to run them so composing complex validation rules is fun.

```javascript
import {
  computedValidator,
  required,
  lengthBetween,
  noMatch,
  confirmed,
  sequence,
  all,
  onProperty
} from 'computed-validator'

export default Ember.Component.extend({
  validator: computedValidator('user', {
    name: all(required(), lengthBetween(3, Infinity), noMatch(/mitch/)),
    dogName: required({
      message: "If you have a dog please tell us its name!",
      when: 'hasDog'
    }),
    password: confirmed('passwordConfirmation'),
    age: sequence(integer(), between(15, 150)),
    city: all(
      onProperty('city.name.length', between(3, 50)),
      onProperty('city.name', exclusion('dumbest', {
        message: "That's not very nice"
      }))
    )
  });
});
```

## Using `validate`

You can use the `validate` validation rule to write one off validations that
don't need to be reused across validators. They work like computed properties.

```javascript
export default Ember.Component.extend({
  validator: computedValidator('user', {
    name: validate('name', function() {
      if (!this.get('name')) {
        return 'You must provide a name';
      }
    })
  });
});
```

Anything you can do with a computed property, you can also do with `validate`.
Just like using a computed property you must add the necessary dependent keys.

```javascript
export default Ember.Component.extend({
  validator: computedValidator('user', {
    dateRange: validate('startDate', 'endDate', function() {
      if (this.get('startDate') >= this.get('endDate')) {
        return 'Start date must be before the end date';
      }
    })
  });
});
```

## Roadmap

* Document existing rules
* Handling async (e.g. ajax) validations
