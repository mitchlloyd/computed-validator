import validationRule from 'computed-validator/validation-rule';

/**
 * A validation rule that changes the default key for another validation.
 *
 * @module
 * @public
 * @param {function} key - Then new property to use as the default key
 * @param {ValidationBlueprint} key - The validation rule to modify
 * @return {object} validationBlueprint
 */
export default validationRule(([key, rule]) => rule(key));
