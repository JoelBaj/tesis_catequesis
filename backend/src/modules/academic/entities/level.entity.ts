import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('niveles')
export class Level {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  materia: string;

  @Column({ type: 'varchar', length: 50 })
  sacramento: string;

  @Column({ name: 'prerequisito_id', type: 'int', nullable: true })
  prerequisitoId: number;

  @Column({ type: 'varchar', length: 5 })
  estado: string;
}
