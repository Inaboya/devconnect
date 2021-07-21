const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  //Required field

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  data.current = !isEmpty(data.current) ? true : false;

  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title field is required";
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = "The Company name field is required";
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
