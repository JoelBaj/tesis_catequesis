import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Level } from './level.entity';

@Entity('planificaciones')
export class Planning {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'nivel_id', type: 'int' })
  nivelId: number;

  @Column({ type: 'varchar', length: 300 })
  tema: string;

  @Column({ name: 'objetivo_general', type: 'text' })
  objetivoGeneral: string;

  @Column({ name: 'objetivo_especifico', type: 'text' })
  objetivoEspecifico: string;

  @Column({ type: 'text' })
  metodologia: string;

  @Column({ type: 'varchar', length: 100 })
  tiempo: string;

  @Column({ type: 'text' })
  recursos: string;

  @ManyToOne(() => Level)
  @JoinColumn({ name: 'nivel_id' })
  level: Level;
}
