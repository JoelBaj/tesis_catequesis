import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from './event.entity';
import { Person } from '@modules/persons/entities/person.entity';

@Entity('asistencias_eventos')
export class EventAttendance {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'evento_id', type: 'int' })
  eventoId: number;

  @Column({ name: 'feligres_id', type: 'int' })
  feligresId: number;

  @Column({ type: 'varchar', length: 2 })
  estado: string;

  @Column({ type: 'varchar', length: 400, nullable: true })
  observacion: string;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'evento_id' })
  event: Event;

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'feligres_id' })
  person: Person;
}
