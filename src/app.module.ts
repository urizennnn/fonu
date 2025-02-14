import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MikroModule } from './lib/mikro-config/mikro.module';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { appConfigFactory } from './config';
import { join } from 'path';
import { GlobalJWTModule } from './lib/middleware/jwt/jwt.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { FonuMiddleware } from './common/interceptors/middleware-logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfigFactory],
      isGlobal: true,
      envFilePath: [join(process.cwd(), '.env')],
      expandVariables: true,
    }),
    GlobalJWTModule,
    LoggerModule,
    MikroModule.forRootAsync(),
    UserModule,
    TaskModule,
    AuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FonuMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
