import Joi from "joi";

export const personaSchema = Joi.object({
  tipoPersona: Joi.string().valid("fisica", "juridica").required().messages({
    "string.empty": "El tipo de persona es requerido",
    "any.only": "Debe seleccionar un tipo válido",
    "any.required": "El tipo de persona es requerido",
  }),
  nombreCompleto: Joi.string().min(3).max(100).required().messages({
    "string.empty": "El nombre completo es requerido",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede exceder 100 caracteres",
    "any.required": "El nombre completo es requerido",
  }),
  documento: Joi.string().min(7).max(15).required().messages({
    "string.empty": "El documento es requerido",
    "string.min": "El documento debe tener al menos 7 caracteres",
    "string.max": "El documento no puede exceder 15 caracteres",
    "any.required": "El documento es requerido",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "El email es requerido",
      "string.email": "El email no es válido",
      "any.required": "El email es requerido",
    }),
  telefono: Joi.string().min(8).max(20).required().messages({
    "string.empty": "El teléfono es requerido",
    "string.min": "El teléfono debe tener al menos 8 caracteres",
    "string.max": "El teléfono no puede exceder 20 caracteres",
    "any.required": "El teléfono es requerido",
  }),
  activo: Joi.boolean().default(true),
});

export type PersonaFormData = {
  tipoPersona: "fisica" | "juridica";
  nombreCompleto: string;
  documento: string;
  email: string;
  telefono: string;
  activo: boolean;
};
