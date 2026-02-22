import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Encounter } from './encounter.entity';
import { Student } from '@modules/persons/entities/student.entity';

@Entity('asistencias')
export class Attendance {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'encuentro_id', type: 'int' })
  encuentroId: number;

  @Column({ name: 'catequizando_id', type: 'int' })
  catequizandoId: number;

  @Column({ type: 'varchar', length: 5 })
  estado: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  observacion: string;

  @ManyToOne(() => Encounter, (encounter) => encounter.attendances)
  @JoinColumn({ name: 'encuentro_id' })
  encounter: Encounter;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'catequizando_id' })
  student: Student;
}
