import { IsString } from '@nestjs/class-validator';

export class UserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;
}
