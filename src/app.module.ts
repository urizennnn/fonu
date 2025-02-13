import { Module } from '@nestjs/common';
import { MikroModule } from './lib/mikro-config/mikro.module';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [MikroModule.forRootAsync(), UserModule, TaskModule],
})
export class AppModule {}
