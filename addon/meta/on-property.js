import validationRule from 'computed-validator/validation-rule';

/**
 * A validation rule that changes the default key for another validation.
 *
 * @param {function} key - Then new property to use as the default key
 * @return {object} validationBlueprint
 */
export default validationRule(([key, rule]) => rule(key));
