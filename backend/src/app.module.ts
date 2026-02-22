import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import * as path from 'path';

import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { ConfigurationModule } from '@modules/configuration/configuration.module';
import { PersonsModule } from '@modules/persons/persons.module';
import { AcademicModule } from '@modules/academic/academic.module';
import { AttendanceModule } from '@modules/attendance/attendance.module';
import { EventsModule } from '@modules/events/events.module';
import { EnrollmentModule } from '@modules/enrollment/enrollment.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // ✅ Asegura que lea el .env desde la raíz del backend
      envFilePath: path.join(__dirname, '..', '.env'),
    }),

    // ✅ Deja SOLO una conexión (esta)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mariadb',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
        logging: false,
      }),
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    AuthModule,
    UsersModule,
    ConfigurationModule,
    PersonsModule,
    AcademicModule,
    AttendanceModule,
    EventsModule,
    EnrollmentModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }