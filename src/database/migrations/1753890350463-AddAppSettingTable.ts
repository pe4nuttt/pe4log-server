import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppSettingTable1753890350463 implements MigrationInterface {
    name = 'AddAppSettingTable1753890350463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`app_setting\` (\`key\` varchar(255) NOT NULL, \`value\` json NOT NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`key\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`app_setting\``);
    }

}
