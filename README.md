# Computed Validator

Validate objects.

**Notice: This Addon is using readme driven development and many of the features
described below are not implemented.**

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
  minLength,
  noMatch,
  when,
  confirmed,
  sequence,
  all,
  useProperty
} from 'computed-validator'

export default Ember.Component.extend({
  validator: computedValidator('user', {
    name: all(required(), minLength(3), noMatch(/mitch/)),
    dogName: when('hasDog', required({
      message: "If you have a dog please tell us its name!"
    })),
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

## The `validate` primitive

The core of Computed Validator is the `validate` function. You can use this to
write one off validations for a single use case or write abstract, reusable
validation rules.

You can treat them as a basic computed property.

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

Or you can use them to create abstract validation rules. In this case you can
use the `subject` and validation `key` to handle general cases. Here is the
implementation of the `required` validation.

```javascript
import Ember from 'ember';
import { validate } from 'computed-validator';
const { get } = Ember;

export default function required() {
  return validate(function(subject, key) {
    if (!get(subject, key)) {
      return "is required";
    }
  });
}
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

The first dependent key arguments of `validate` can be:

1. Omitted. In this case, the key used to identify the validation will be used as
   the dependent key.

    ```javascript
    export default Ember.Component.extend({
      validator: computedValidator('user', {
        // 'name' is the default key
        name: validate(function() {
          if (!this.get('name')) {
            return 'You must provide a name';
          }
        })
      });
    });
    ```

2. A list of dependent keys — just like a computed property.

3. A function that accepts the key used to identify the validation and returns
   an array of dependent keys. For instance, the `confirmed` validation rule
   uses a function to return the identifier key

    ```javascript
    import Ember from 'ember';
    import { validate } from 'computed-validator';
    const { get } = Ember;

    export default function confirmed(keyToMatch) {
      return validate(key => [key, keyToMatch], function(subject, key) {
        if (get(subject, key) !== get(subject, keyToMatch)) {
          return `must match ${keyToMatch}`;
        }
      });
    }
    ```

## Roadmap

* More validation rules
* Handling dynamic messages
* Handling async (e.g. ajax) validations
