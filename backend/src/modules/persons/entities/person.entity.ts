import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from './student.entity';
import { Catechist } from './catechist.entity';
import { Teacher } from './teacher.entity';

@Entity('feligres')
export class Person {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  cedula: string;

  @Column({ type: 'varchar', length: 100 })
  nombres: string;

  @Column({ type: 'varchar', length: 100 })
  apellidos: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fechaNacimiento: Date;

  @Column({ name: 'ciudad_nacimiento', type: 'varchar', length: 50, nullable: true })
  ciudadNacimiento: string;

  @Column({ name: 'localidad_nacimiento', type: 'varchar', length: 50, nullable: true })
  localidadNacimiento: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  domicilio: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  correo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  sexo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nacionalidad: string;

  @OneToMany(() => Student, (student) => student.person)
  studentProfile: Student[];

  @OneToMany(() => Catechist, (catechist) => catechist.person)
  catechistProfile: Catechist[];

  @OneToMany(() => Teacher, (teacher) => teacher.person)
  teacherProfile: Teacher[];
}
