/**
 * A class that represents a validation error.
 *
 * @public
 * @class
 * @param {string} id - A key to use for translation
 * @param {object} properties - An object containing properties to use for
 * translation
 */
class ValidationError {
  constructor(id, properties) {
    this.id = id;
    this.properties = properties;
  }
}

export default ValidationError;
