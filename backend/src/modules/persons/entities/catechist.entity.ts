import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Person } from './person.entity';

@Entity('catequistas')
export class Catechist {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'feligres_id', type: 'int' })
  feligresId: number;

  @Column({ name: 'nivel_id', type: 'int' })
  nivelId: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  titulo1: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  titulo2: string;

  @Column({ name: 'anios_apostolado', type: 'int' })
  aniosApostolado: number;

  @Column({ type: 'varchar', length: 5 })
  estado: string;

  @Column({ type: 'varchar', length: 50 })
  tipo: string;

  @ManyToOne(() => Person, (person) => person.catechistProfile)
  @JoinColumn({ name: 'feligres_id' })
  person: Person;
}
