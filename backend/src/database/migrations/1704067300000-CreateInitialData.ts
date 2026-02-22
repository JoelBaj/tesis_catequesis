import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialData1704067300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert default countries
    await queryRunner.query(`
      INSERT IGNORE INTO countries (id, name, code, isActive, createdAt, updatedAt) VALUES
      ('550e8400-e29b-41d4-a716-446655440000', 'Ecuador', 'ECU', true, NOW(), NOW()),
      ('550e8400-e29b-41d4-a716-446655440001', 'Perú', 'PER', true, NOW(), NOW()),
      ('550e8400-e29b-41d4-a716-446655440002', 'Colombia', 'COL', true, NOW(), NOW());
    `);

    // Insert parameter types
    await queryRunner.query(`
      INSERT IGNORE INTO parameter_types (id, type, code, description, isGcp, isGsm, quota, isActive, createdAt, updatedAt) VALUES
      ('650e8400-e29b-41d4-a716-446655440000', 'HM', 'HM', 'Horario Matutino', false, false, null, true, NOW(), NOW()),
      ('650e8400-e29b-41d4-a716-446655440001', 'SR', 'SR', 'Sábado y Domingo', false, false, null, true, NOW(), NOW()),
      ('650e8400-e29b-41d4-a716-446655440002', 'AS', 'P', 'Presente', false, false, null, true, NOW(), NOW()),
      ('650e8400-e29b-41d4-a716-446655440003', 'AS', 'A', 'Ausente', false, false, null, true, NOW(), NOW()),
      ('650e8400-e29b-41d4-a716-446655440004', 'EV', 'MD', 'Misión Diocesana', false, false, null, true, NOW(), NOW()),
      ('650e8400-e29b-41d4-a716-446655440005', 'ES', 'AC', 'Activo', false, false, null, true, NOW(), NOW());
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM parameter_types;`);
    await queryRunner.query(`DELETE FROM countries;`);
  }
}
