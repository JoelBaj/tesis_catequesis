import { Course } from '@app/models/academic.model';
import { Catechist } from '@app/models/persons.model';

export interface Encounter {
  id: string;
  cursoId: number;
  catequistaId: number;
  fecha: string;
  horario: string;
  tema: string;
  actividades?: string;
  observacionCatequista?: string;
  course?: Course;
  catechist?: Catechist;
}

export interface Attendance {
  id: number;
  encuentroId: number;
  catequizandoId: number;
  estado: string;
  observacion?: string;
  encounter?: Encounter;
  student?: any;
}
