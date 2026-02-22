import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '@modules/persons/entities/student.entity';
import { Course } from '@modules/academic/entities/course.entity';

@Entity('matriculas')
export class Enrollment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'curso_id', type: 'int' })
  cursoId: number;

  @Column({ name: 'catequizando_id', type: 'int' })
  catequizandoId: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  observacion: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'catequizando_id' })
  student: Student;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'curso_id' })
  course: Course;
}
