import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AppLogger } from 'src/infrastructure/logger/logger';
import { MikroModule } from 'src/lib/mikro-config/mikro.module';
import { JWTService } from 'src/lib/middleware/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MikroModule.forRootAsync(),JwtModule],
  controllers: [UserController],
  providers: [UserService, AppLogger,JWTService],
})
export class UserModule {}
