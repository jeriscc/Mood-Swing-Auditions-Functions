import * as Joi from "@hapi/joi";

export type Auditionee = {
  id: string;
  name: string;
  number: Number;
  picture: string;
};

export const postSchema = Joi.object({
  name: Joi.string()
    .required(),

  picture: Joi.string()
    .uri()
    .required(),

  number: Joi.number()
    .integer()
    .required()
});

// export const isValid = (input: object) => schema.validate(input);
