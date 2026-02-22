import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_parametros')
export class ParameterType {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  tipos: string;

  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  descripcion: string;

  @Column({ type: 'int', nullable: true })
  gcp: number;

  @Column({ type: 'int', nullable: true })
  gsm: number;

  @Column({ type: 'int', nullable: true })
  cupo: number;
}
