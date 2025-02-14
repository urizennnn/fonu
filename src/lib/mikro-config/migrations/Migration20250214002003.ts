import { Migration } from '@mikro-orm/migrations';

export class Migration20250214002003 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`task\` (\`id\` varchar(36) not null, \`description\` text not null, \`status\` enum('active', 'completed') not null default 'active', \`created_at\` date not null, \`updated_at\` date not null, \`user_id\` varchar(36) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`task\` add index \`task_user_id_index\`(\`user_id\`);`);

    this.addSql(`alter table \`task\` add constraint \`task_user_id_foreign\` foreign key (\`user_id\`) references \`user\` (\`id\`) on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`task\`;`);
  }

}
