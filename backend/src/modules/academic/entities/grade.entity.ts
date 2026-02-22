import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from './course.entity';
import { Student } from '@modules/persons/entities/student.entity';

@Entity('calificaciones')
export class Grade {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  periodo: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  parcial: string;

  @Column({ name: 'curso_id', type: 'int' })
  cursoId: number;

  @Column({ name: 'catequizando_id', type: 'int' })
  catequizandoId: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  tareas: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  lecciones: number;

  @Column({ name: 'evaluacion_oral', type: 'decimal', precision: 4, scale: 2, nullable: true })
  evaluacionOral: number;

  @Column({ name: 'evaluacion_escrita', type: 'decimal', precision: 4, scale: 2, nullable: true })
  evaluacionEscrita: number;

  @Column({ type: 'varchar', length: 50 })
  cualitativa: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  cuantitativa: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'curso_id' })
  course: Course;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'catequizando_id' })
  student: Student;
}
