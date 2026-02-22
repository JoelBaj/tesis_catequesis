export interface Event {
  id: number;
  tipoevento: string;
  nombre: string;
  fecha: string;
  lugar?: string;
  descripcion?: string;
  estado: string;
  observacion?: string;
}

export interface EventAttendance {
  id: number;
  eventoId: number;
  feligresId: number;
  estado: string;
  observacion?: string;
  event?: Event;
  person?: {
    id: number;
    nombres: string;
    apellidos: string;
    cedula: string;
  };
}
