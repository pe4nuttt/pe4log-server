import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreateColumnLoginAttempt1753372545393
  implements MigrationInterface
{
  name = 'AddCreateColumnLoginAttempt1753372545393';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`login_attempt\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`login_attempt\` DROP COLUMN \`createdAt\``,
    );
  }
}
