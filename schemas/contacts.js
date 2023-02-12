const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "any.required": "you should provide name!!",
  }),
  phone: Joi.string()
    .min(10)
    .required()
    .messages({ "any.required": "you should provide phone!!" }),
  email: Joi.string(),
});

const updateFavoriteField = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "missing field favorite",
  }),
});

module.exports = {
  addContactSchema,
  updateFavoriteField,
};
