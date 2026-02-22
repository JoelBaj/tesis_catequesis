export interface Level {
  id: string;
  materia: string;
  sacramento: string;
  prerequisitoId?: number;
  estado: string;
}

export interface Course {
  id: string;
  nivelId: number;
  grupo?: string;
  paralelo?: string;
  catequistaId: number;
  catequistaAuxiliarId?: number;
  catequistaSupleteId?: number;
  estado: string;
  aula: string;
  cupo: number;
  tipoCurso?: string;
  periodo: string;
  level?: Level;
}

export interface Subject {
  id: number;
  materia: string;
  sacramento: string;
  prerequisitoId?: number;
  estado: string;
}

export interface Planning {
  id: string;
  nivelId: number;
  tema: string;
  objetivoGeneral?: string;
  objetivoEspecifico?: string;
  metodologia?: string;
  tiempo?: string;
  recursos?: string;
  level?: Level;
}

export interface Grade {
  id: number;
  periodo: string;
  parcial: string;
  cursoId: number;
  catequizandoId: number;
  tareas?: number;
  lecciones?: number;
  evaluacionOral?: number;
  evaluacionEscrita?: number;
  cualitativa: string;
  cuantitativa?: number;
  observaciones?: string;
  course?: Course;
  student?: {
    id: number;
    person?: {
      nombres: string;
      apellidos: string;
      cedula: string;
    };
  };
}
