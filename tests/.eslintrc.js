module.exports = {
  plugins: ["qunit"],
  env: {
    'embertest': true
  },
  rules: {
    'qunit/assert-args': 2,
    'qunit/literal-compare-order': 2,
    'qunit/no-negated-ok': 2,
    'qunit/no-only': 2,
    'qunit/require-expect': [2, 'except-simple']
  }
};
