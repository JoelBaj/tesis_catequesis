import './register';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import * as dotenv from 'dotenv';
import { createConnection } from 'mysql2/promise';
import * as path from 'path';
import cookieParser from 'cookie-parser';

// 🔹 Cargar .env desde la raíz del backend
dotenv.config({ path: path.join(__dirname, '..', '.env') });

/**
 * 🔹 Verifica que la base exista y la crea si no existe
*/
async function ensureDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USERNAME || 'root';
  const password = process.env.DB_PASSWORD || 'root';
  const database = process.env.DB_DATABASE || 'parroquia_db';

  console.log(`🔌 Conectando a DB en ${host}:${port} como ${user}`);
  console.log(`📊 Base de datos objetivo: ${database}`);

  const connection = await createConnection({
    host,
    port,
    user,
    password,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;`,
  );

  await connection.end();

  console.log(`✅ Base de datos verificada`);
}

/**
 * 🔹 Arranque de NestJS

 */
async function bootstrap() {
  // 1️⃣ Crear DB si no existe
  await ensureDatabase();

  // 2️⃣ Crear app Nest
  const app = await NestFactory.create(AppModule);

  // 3️⃣ Prefijo global de rutas
  app.setGlobalPrefix('api-catequesis');
  app.use(cookieParser());
  // 4️⃣ CORS
  app.enableCors({
    // origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    origin: [
      'http://192.168.100.76',
    ],
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // 5️⃣ Filtro global de excepciones DB
  app.useGlobalFilters(new DatabaseExceptionFilter());

  // 6️⃣ Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 7️⃣ Swagger
  const config = new DocumentBuilder()
    .setTitle('Catequesis API')
    .setDescription('API para gestión de catequesis en parroquias')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Autenticación y autorización')
    .addTag('Configuration', 'Configuración base del sistema')
    .addTag('Persons', 'Gestión de personas')
    .addTag('Academic', 'Módulo académico')
    .addTag('Attendance', 'Asistencias y encuentros')
    .addTag('Events', 'Eventos parroquiales')
    .addTag('Enrollment', 'Matrículas')
    .addTag('Users', 'Gestión de usuarios')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 8️⃣ Puerto
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
  console.log(`📚 Swagger en http://localhost:${port}/api/docs`);
}

bootstrap();