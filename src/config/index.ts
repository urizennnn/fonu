import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AppConfigSchema } from './app.schema';

export const appConfigFactory = registerAs('app', () => {
  const env = plainToInstance(AppConfigSchema, process.env, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
    exposeUnsetFields: true,
  });

  const errors = validateSync(env, { whitelist: true });
  console.log(env);

  if (errors.length > 0) throw new Error(errors.toString());

  const database = new URL(env.database_url);
  const databaseName = database.pathname.replace(/^\/+/, '');
  return {
    port: (env.port || 4000) as 4000,
    jwt: {
      secret: env.jwt_secret,
      expires_in: env.jwt_expires_in,
    },
    db: {
      href: database.href,
      host: database.hostname,
      username: database.username,
      password: database.password,
      pathname: databaseName,
      port: database.port,
    },
  } as const;
});

export type AppConfig = ReturnType<typeof appConfigFactory>;
