import { defineConfig } from '@mikro-orm/core';
import path from 'path';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { MySqlDriver } from '@mikro-orm/mysql';
import { Task } from './src/infrastructure/database/schemas/task';
import { User } from './src/infrastructure/database/schemas/user';
import 'dotenv/config';

export default defineConfig({
  entitiesTs: ['src/infrastructure/database/**/*.ts'],
  entities: [Task, User],
  dbName: 'fonu',
  driver: MySqlDriver,
  host: 'localhost',
  port: 3306,
  user: 'urizen',
  password: 'urizen',
  debug: true,
  migrations: {
    path: path.join(__dirname, './src/lib/mikro-config/migrations'),
  },
  allowGlobalContext: true,
  metadataProvider: TsMorphMetadataProvider,
});
