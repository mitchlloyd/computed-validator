export default class ValidationState {
  constructor(errors) {
    this.errors = errors;
  }

  get isValid() {
    return !this.errors.length;
  }

  get hasErrors() {
    return !this.isValid;
  }

  get firstError() {
    return this.errors[0] || null;
  }
}
