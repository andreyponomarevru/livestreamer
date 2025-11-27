/* eslint-disable no-control-regex */

import Joi from "joi";

export const asciiRegex = new RegExp("^[\x00-\x7F]+$");
export const alphaNumericRegex = new RegExp("^[a-zA-Z0-9-._]+$");

export const passwordSchema = Joi.string()
  .required()
  .min(6)
  .max(50)
  .pattern(asciiRegex)
  .messages({
    "string.base": `Password should be a type of 'string'`,
    "string.empty": `Password cannot be an empty string`,
    "string.min": `Password is shorter than expected`,
    "string.max": `Password is longer than expected`,
    "any.required": `Password is required`,
  });

export const usernameSchema = Joi.string()
  .trim()
  .required()
  .min(3)
  .max(16)
  .pattern(alphaNumericRegex)
  .messages({
    "string.base": `Username should be a type of 'string'`,
    "string.empty": `Username cannot be an empty string`,
    "string.min": `Username is shorter than expected`,
    "string.max": `Username is longer than expected`,
    "any.required": `Username is required`,
  });

export const emailSchema = Joi.string().max(320).required().email().messages({
  "string.base": `Email should be a type of 'string'`,
  "string.empty": `Email cannot be an empty string`,
  "string.email": `The string is not a valid e-mail`,
  "any.required": `Email is required`,
});

export const tokenSchema = Joi.string().required().messages({
  "string.base": `Token value should be a type of 'string'`,
  "string.empty": `Token value cannot be an empty string`,
  "any.required": `Token value is required`,
});

export const jsonContentTypeSchema = Joi.object({
  "content-type": Joi.string().required().valid("application/json").messages({
    "string.base": `'content-type' should be a type of 'string'`,
    "string.empty": `'content-type' cannot be an empty string`,
    "any.required": `'content-type' is required`,
  }),
})
  .required()
  .unknown(true);

export const idSchema = Joi.number().positive().greater(0).required().messages({
  "number.base": `id should be a type of 'number'`,
  "number.positive": `id should be positive`,
  "number.greater": `id should be greater than 1`,
  "any.required": `id is required`,
});
