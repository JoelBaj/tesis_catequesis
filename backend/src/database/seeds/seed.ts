import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';

async function seed() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🌱 Iniciando seed de datos...');
    
    // Crear usuario Admin
    const usersRepository = dataSource.getRepository(User);
    
    const hashedPassword = await bcrypt.hash('admin', 10);
    
    const adminUser = {
      nombre: 'admin',
      correo: 'admin@catequesis.com',
      contrasena: hashedPassword,
      rol: 'admin',
      isActive: true,
    };

    // Verificar si el usuario ya existe
    const existingUser = await usersRepository.findOne({ where: { nombre: 'admin' } });
    if (!existingUser) {
      await usersRepository.save(adminUser);
      console.log('✅ Usuario Admin creado:');
      console.log('   - Nombre: admin');
      console.log('   - Contraseña: admin');
      console.log('   - Rol: admin');
    } else {
      await usersRepository.save({
        ...existingUser,
        contrasena: hashedPassword,
        rol: 'admin',
        isActive: true,
      });
      console.log('✅ Usuario Admin actualizado:');
      console.log('   - Nombre: admin');
      console.log('   - Contraseña: admin');
      console.log('   - Rol: admin');
    }

    console.log('✅ Seed completado exitosamente');
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

seed();
