import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Province } from './province.entity';

@Entity('cities')
@Index(['name', 'provinceId', 'isActive'], { unique: true })
@Index(['code', 'provinceId', 'isActive'], { unique: true })
export class City {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  code: string;

  @Column({ type: 'int' })
  provinceId: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Province, (province) => province.cities)
  @JoinColumn({ name: 'provinceId' })
  province: Province;
}
