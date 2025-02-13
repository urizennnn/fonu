import { Module, DynamicModule } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/mysql';
import config from './mikro';
import { AppLogger } from 'src/infrastructure/logger/logger';

export const MICRO_ORM_TOKEN = Symbol('MICRO_ORM_TOKEN');

@Module({})
export class MikroModule {
  static forRootAsync(): DynamicModule {
    return {
      module: MikroModule,
      providers: [
        AppLogger,
        {
          provide: MICRO_ORM_TOKEN,
          useFactory: async (logger: AppLogger) => {
            const orm = await MikroORM.init(config);
            logger.info('MikroORM initialized successfully');
            return orm;
          },
          inject: [AppLogger],
        },
      ],
      exports: [MICRO_ORM_TOKEN],
    };
  }
}
