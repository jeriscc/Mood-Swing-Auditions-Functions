import * as Joi from "@hapi/joi";

export type Auditionee = {
  id: string; // unique identification id of Auditionee
  name: string;
  number: Number;
  picture: string;
  voice_part: string;
};

export const postSchema = Joi.object({
  name: Joi.string()
    .required(),

  number: Joi.number()
    .integer()
    .required(),

  picture: Joi.string()
    .uri()
    .required(),

  voice_part: Joi.string()
    .valid('bass', 'bari', 'tenor', 'alto', 'mezzo', 'sop')
    .required()
});

// export const isValid = (input: object) => schema.validate(input);
