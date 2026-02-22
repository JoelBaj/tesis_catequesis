import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Person } from './person.entity';

@Entity('catequizandos')
export class Student {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'feligres_id', type: 'int' })
  feligresId: number;

  @Column({ type: 'varchar', length: 5 })
  estado: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  observacion: string;

  @Column({ name: 'necesidad_especial', type: 'char', length: 2 })
  necesidadEspecial: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string;

  @Column({ name: 'madre_id', type: 'int', nullable: true })
  madreId: number;

  @Column({ name: 'padre_id', type: 'int', nullable: true })
  padreId: number;

  @Column({ name: 'representante_id', type: 'int', nullable: true })
  representanteId: number;

  @Column({ type: 'int' })
  edad: number;

  @Column({ name: 'padres_casados', type: 'char', length: 2, nullable: true })
  padresCasados: string;

  @Column({ name: 'padres_boda_civil', type: 'char', length: 2, nullable: true })
  padresBodaCivil: string;

  @Column({ type: 'int', nullable: true })
  bautizo: number;

  @ManyToOne(() => Person, (person) => person.studentProfile)
  @JoinColumn({ name: 'feligres_id' })
  person: Person;

  @ManyToOne(() => Person, { nullable: true })
  @JoinColumn({ name: 'madre_id' })
  mother: Person;

  @ManyToOne(() => Person, { nullable: true })
  @JoinColumn({ name: 'padre_id' })
  father: Person;

  @ManyToOne(() => Person, { nullable: true })
  @JoinColumn({ name: 'representante_id' })
  representative: Person;
}
