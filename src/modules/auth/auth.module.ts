import { Module } from '@nestjs/common';
import { JWTService } from 'src/lib/middleware/jwt/jwt.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AppLogger } from 'src/infrastructure/logger/logger';
import { ConfigService } from '@nestjs/config';
import { MikroModule } from 'src/lib/mikro-config/mikro.module';
import { GlobalJWTModule } from 'src/lib/middleware/jwt/jwt.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MikroModule.forRootAsync(),
    GlobalJWTModule.initAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('app.jwt.secret'),
      }),
    }),
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AppLogger, JWTService],
})
export class AuthModule {}
