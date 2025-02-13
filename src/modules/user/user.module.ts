import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AppLogger } from 'src/infrastructure/logger/logger';
import { MikroModule } from 'src/lib/mikro-config/mikro.module';

@Module({
  imports: [MikroModule.forRootAsync()],
  controllers: [UserController],
  providers: [UserService, AppLogger],
})
export class UserModule {}
