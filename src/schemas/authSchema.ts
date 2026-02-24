import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "El email es requerido",
      "string.email": "El email no es válido",
      "any.required": "El email es requerido",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "La contraseña es requerida",
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "any.required": "La contraseña es requerida",
  }),
});

export const registerSchema = Joi.object({
  nombre: Joi.string().min(3).max(50).required().messages({
    "string.empty": "El nombre es requerido",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede exceder 50 caracteres",
    "any.required": "El nombre es requerido",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "El email es requerido",
      "string.email": "El email no es válido",
      "any.required": "El email es requerido",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "La contraseña es requerida",
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "any.required": "La contraseña es requerida",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "string.empty": "Debe confirmar la contraseña",
    "any.only": "Las contraseñas no coinciden",
    "any.required": "Debe confirmar la contraseña",
  }),
});

export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
};
