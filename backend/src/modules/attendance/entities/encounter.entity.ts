import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Course } from '@modules/academic/entities/course.entity';
import { Planning } from '@modules/academic/entities/planning.entity';
import { Catechist } from '@modules/persons/entities/catechist.entity';
import { Attendance } from './attendance.entity';

@Entity('encuentros')
export class Encounter {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'curso_id', type: 'int' })
  cursoId: number;

  @Column({ type: 'varchar', length: 50 })
  horario: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ name: 'catequista_id', type: 'int' })
  catequistaId: number;

  @Column({ type: 'varchar', length: 300 })
  tema: string;

  @Column({ type: 'text', nullable: true })
  actividades: string;

  @Column({ name: 'observacion_catequista', type: 'text', nullable: true })
  observacionCatequista: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'curso_id' })
  course: Course;

  @ManyToOne(() => Catechist)
  @JoinColumn({ name: 'catequista_id' })
  catechist: Catechist;

  @OneToMany(() => Attendance, (attendance) => attendance.encounter)
  attendances: Attendance[];
}
