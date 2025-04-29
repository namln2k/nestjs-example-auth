import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUserRoles1745915782551 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO roles (name) VALUES
            ('admin'),
            ('user'),
            ('guest'),
            ('moderator')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM roles WHERE name IN ('admin', 'user', 'guest', 'moderator')
        `);
    await queryRunner.query(`
            DELETE FROM user_role WHERE roleId IN (
                SELECT id FROM roles WHERE name IN ('admin', 'user', 'guest', 'moderator')
            )
        `);
  }
}
