import Joi from "joi";

export const inmuebleSchema = Joi.object({
  tipo: Joi.string().valid("casa", "campo").required().messages({
    "string.empty": "El tipo de inmueble es requerido",
    "any.only": "Debe seleccionar un tipo válido",
    "any.required": "El tipo de inmueble es requerido",
  }),
  descripcion: Joi.string().min(10).max(500).required().messages({
    "string.empty": "La descripción es requerida",
    "string.min": "La descripción debe tener al menos 10 caracteres",
    "string.max": "La descripción no puede exceder 500 caracteres",
    "any.required": "La descripción es requerida",
  }),
  ubicacion: Joi.string().min(5).max(200).required().messages({
    "string.empty": "La ubicación es requerida",
    "string.min": "La ubicación debe tener al menos 5 caracteres",
    "string.max": "La ubicación no puede exceder 200 caracteres",
    "any.required": "La ubicación es requerida",
  }),
  hectareas: Joi.number().positive().optional().allow(null, "").messages({
    "number.base": "Las hectáreas deben ser un número",
    "number.positive": "Las hectáreas deben ser mayor a 0",
  }),
  activo: Joi.boolean().default(true),
});

export type InmuebleFormData = {
  tipo: "casa" | "campo";
  descripcion: string;
  ubicacion: string;
  hectareas?: number;
  activo?: boolean;
};
