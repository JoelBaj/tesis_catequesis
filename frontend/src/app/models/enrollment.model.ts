export interface Enrollment {
  id: number;
  cursoId: number;
  catequizandoId: number;
  fecha: string;
  observacion?: string;
  student?: {
    id: number;
    person: {
      id: number;
      nombres: string;
      apellidos: string;
      cedula: string;
    };
  };
  course?: {
    id: number;
    grupo: string;
    paralelo: string;
    aula?: string;
  };
}
