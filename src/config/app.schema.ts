import { IsNumber, IsString } from 'class-validator';
import { Transform, Expose } from 'class-transformer';

export class AppConfigSchema {
  @Expose({ name: 'PORT' })
  @Transform(({ value }) => (value ? Number(value) : 4000))
  @IsNumber()
  port!: number;

  @Expose({ name: 'DATABASE_URL' })
  @IsString()
  database_url!: string;

  @Expose({ name: 'JWT_SECRET' })
  @IsString()
  jwt_secret!: string;

  @Expose({ name: 'JWT_EXPIRES_IN' })
  @Transform(({ value }) => value)
  @IsString()
  jwt_expires_in!: string;
}
