import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommentReactionTable1752076184628 implements MigrationInterface {
  name = 'CommentReactionTable1752076184628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`comment-reactions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('0', '1') NULL, \`userId\` int NULL, \`commentId\` int NULL, INDEX \`idx_comment_id\` (\`commentId\`), UNIQUE INDEX \`IDX_5c53031d4137bd6d55d98c2cde\` (\`userId\`, \`commentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment-reactions\` ADD CONSTRAINT \`FK_c8aa8f327fe4cedf78e2835b24b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment-reactions\` ADD CONSTRAINT \`FK_8fd5f47eeec7386ac91fe62731f\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment-reactions\` DROP FOREIGN KEY \`FK_8fd5f47eeec7386ac91fe62731f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment-reactions\` DROP FOREIGN KEY \`FK_c8aa8f327fe4cedf78e2835b24b\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5c53031d4137bd6d55d98c2cde\` ON \`comment-reactions\``,
    );
    await queryRunner.query(
      `DROP INDEX \`idx_comment_id\` ON \`comment-reactions\``,
    );
    await queryRunner.query(`DROP TABLE \`comment-reactions\``);
  }
}
