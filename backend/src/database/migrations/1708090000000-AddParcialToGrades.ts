import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParcialToGrades1708090000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `calificaciones` ADD COLUMN `parcial` varchar(20) NULL AFTER `periodo`",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `calificaciones` DROP COLUMN `parcial`");
  }
}
