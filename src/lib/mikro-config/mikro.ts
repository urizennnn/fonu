import { defineConfig } from '@mikro-orm/core';
import path from 'path';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { MySqlDriver } from '@mikro-orm/mysql';
import 'dotenv/config';
import { Task } from '../../infrastructure/database/schemas/task';

export default defineConfig({
  entitiesTs: ['../../infrastructure/database/**/*.ts'],
  entities: [Task],
  dbName: process.env.DB_NAME,
  driver: MySqlDriver,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT! || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: path.join(__dirname, './migrations'),
  },
  allowGlobalContext: true,
  metadataProvider: TsMorphMetadataProvider,
});
