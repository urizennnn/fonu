import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities/user/user.entity';
import { JWTService } from 'src/utils/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GlobalJWTModule } from 'src/utils/jwt/jwt.module';

@Module({
  imports: [
    JwtModule,
    MikroOrmModule.forFeature([User]),
    GlobalJWTModule.initAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JWTService],
})
export class UserModule {}
