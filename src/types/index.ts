// Tipos de datos del backend
export interface Persona {
  _id?: string;
  tipoPersona: 'fisica' | 'juridica';
  nombreCompleto: string;
  documento: string;
  email: string;
  telefono: string;
}

export interface Inmueble {
  _id?: string;
  tipo: 'casa' | 'campo';
  descripcion: string;
  ubicacion: string;
  hectareas: number;
}

export interface Contrato {
  _id?: string;
  tipoContrato: string;
  locador: string | Persona;
  locatario: string | Persona;
  inmueble: string | Inmueble;
  fechaInicio: string;
  fechaFin: string;
  monto: number;
  creadoPor?: string;
}

export interface Usuario {
  _id?: string;
  nombre: string;
  email: string;
  rol: 'usuario' | 'admin';
  token?: string;
}
