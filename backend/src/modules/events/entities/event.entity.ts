import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('evento')
export class Event {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 2 })
  tipoevento: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'varchar', length: 150, nullable: true })
  lugar: string;

  @Column({ type: 'varchar', length: 400, nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 2 })
  estado: string;

  @Column({ type: 'varchar', length: 400, nullable: true })
  observacion: string;
}
