import Joi from "joi";

export const contratoSchema = Joi.object({
  tipoContrato: Joi.string().min(3).max(50).required().messages({
    "string.empty": "El tipo de contrato es requerido",
    "string.min": "El tipo debe tener al menos 3 caracteres",
    "string.max": "El tipo no puede exceder 50 caracteres",
    "any.required": "El tipo de contrato es requerido",
  }),
  locador: Joi.string().required().messages({
    "string.empty": "Debe seleccionar un locador",
    "any.required": "El locador es requerido",
  }),
  locatario: Joi.string().required().invalid(Joi.ref("locador")).messages({
    "string.empty": "Debe seleccionar un locatario",
    "any.required": "El locatario es requerido",
    "any.invalid": "El locador y locatario no pueden ser la misma persona",
  }),
  inmueble: Joi.string().required().messages({
    "string.empty": "Debe seleccionar un inmueble",
    "any.required": "El inmueble es requerido",
  }),
  fechaInicio: Joi.date().required().messages({
    "date.base": "La fecha de inicio debe ser una fecha válida",
    "any.required": "La fecha de inicio es requerida",
  }),
  fechaFin: Joi.date()
    .greater(Joi.ref("fechaInicio"))
    .optional()
    .allow("", null)
    .messages({
      "date.base": "La fecha de fin debe ser una fecha válida",
      "date.greater": "La fecha de fin debe ser posterior a la fecha de inicio",
    }),
  monto: Joi.number().positive().required().messages({
    "number.base": "El monto debe ser un número",
    "number.positive": "El monto debe ser mayor a 0",
    "any.required": "El monto es requerido",
  }),
});

export type ContratoFormData = {
  tipoContrato: string;
  locador: string;
  locatario: string;
  inmueble: string;
  fechaInicio: Date | string;
  fechaFin?: Date | string;
  monto: number;
};
