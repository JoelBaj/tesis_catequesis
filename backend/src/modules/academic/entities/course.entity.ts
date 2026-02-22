import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Level } from './level.entity';
import { Catechist } from '@modules/persons/entities/catechist.entity';

@Entity('cursos')
export class Course {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'nivel_id', type: 'int' })
  nivelId: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  grupo: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  paralelo: string;

  @Column({ name: 'catequista_id', type: 'int' })
  catequistaId: number;

  @Column({ name: 'catequista_auxiliar_id', type: 'int', nullable: true })
  catequistaAuxiliarId: number;

  @Column({ name: 'catequista_suplente_id', type: 'int', nullable: true })
  catequistaSupleteId: number;

  @Column({ type: 'varchar', length: 5 })
  estado: string;

  @Column({ type: 'varchar', length: 50 })
  aula: string;

  @Column({ type: 'int' })
  cupo: number;

  @Column({ name: 'tipo_curso', type: 'varchar', length: 50, nullable: true })
  tipoCurso: string;

  @Column({ type: 'varchar', length: 50 })
  periodo: string;

  @ManyToOne(() => Level)
  @JoinColumn({ name: 'nivel_id' })
  level: Level;

  @ManyToOne(() => Catechist)
  @JoinColumn({ name: 'catequista_id' })
  catechist: Catechist;

  @ManyToOne(() => Catechist, { nullable: true })
  @JoinColumn({ name: 'catequista_auxiliar_id' })
  auxiliarCatechist: Catechist;

  @ManyToOne(() => Catechist, { nullable: true })
  @JoinColumn({ name: 'catequista_suplente_id' })
  supplyingCatechist: Catechist;
}
