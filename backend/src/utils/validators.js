const validator = require('validator');

const validateEmail = (email) => validator.isEmail(email);
const validatePassword = (pass) => pass.length >= 8;
const validateDOB = (dob) => {
  const age = (new Date() - new Date(dob)) / (1000 * 3600 * 24 * 365);
  return age >= 18;
};
const validateSCC = (scc, validList) => validList.includes(scc);

module.exports = { validateEmail, validatePassword, validateDOB, validateSCC };