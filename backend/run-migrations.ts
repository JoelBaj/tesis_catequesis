import { DataSource } from 'typeorm';
import 'dotenv/config';

const isProd = process.env.NODE_ENV === 'production';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3305'),
  username: process.env.DB_USERNAME || 'catequista',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_DATABASE || 'catequesis',
  entities: isProd ? ['dist/**/*.entity.js'] : ['src/**/*.entity.ts'],
  migrations: isProd ? ['dist/database/migrations/*.js'] : ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

AppDataSource.initialize()
  .then(async () => {
    console.log('📊 DataSource initialized');
    const migrations = await AppDataSource.runMigrations();
    console.log('✅ Migrations executed:', migrations.length);
    await AppDataSource.destroy();
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
