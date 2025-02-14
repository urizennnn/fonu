import { Module, DynamicModule } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/mysql';
import { defineConfig } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { MySqlDriver } from '@mikro-orm/mysql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { join } from 'path';
import { AppLogger } from '../../infrastructure/logger/logger';
import { MIKRO_ORM_TOKEN } from '../../shared/constants/index';
import { Task } from '../../infrastructure/database/schemas/task';
import { User } from '../../infrastructure/database/schemas/user';

@Module({})
export class MikroModule {
  static forRootAsync(): DynamicModule {
    return {
      module: MikroModule,
      providers: [
        AppLogger,
        {
          provide: MIKRO_ORM_TOKEN,
          useFactory: async (
            logger: AppLogger,
            configService: ConfigService,
          ) => {
            const dbConfig = configService.get('app.db');
            const ormConfig = defineConfig({
              entitiesTs: ['../../infrastructure/database/**/*.ts'],
              entities: [Task, User],
              dbName: dbConfig.pathname,
              driver: MySqlDriver,
              host: dbConfig.host,
              port: +dbConfig.port,
              user: dbConfig.username,
              password: dbConfig.password,
              debug: process.env.NODE_ENV !== 'production',
              migrations: {
                path: join(__dirname, './migrations'),
              },
              allowGlobalContext: true,
              metadataProvider: TsMorphMetadataProvider,
            });
            const orm = await MikroORM.init(ormConfig);
            logger.info('MikroORM initialized successfully');
            return orm;
          },
          inject: [AppLogger, ConfigService],
        },
      ],
      exports: [MIKRO_ORM_TOKEN],
    };
  }
}
