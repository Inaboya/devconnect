const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  //Required field

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  data.current = !isEmpty(data.current) ? true : false;

  if (Validator.isEmpty(data.school)) {
    errors.school = "Job title field is required";
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "The Company name field is required";
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "The field of study name field is required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from =
      "Please indicate the time you started work at the said company";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
