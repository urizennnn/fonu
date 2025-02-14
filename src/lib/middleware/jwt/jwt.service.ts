import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/infrastructure/database/schemas/user';

type PAYLOAD = Pick<User, 'id' | 'email'>;

@Injectable()
export class JWTService {
  private readonly secret: string;
  private readonly expiresIn: string | number;

  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {
    this.secret = this.config.get<string>('app.jwt.secret')!;
    this.expiresIn = this.config.get<string | number>('app.jwt.expires_in')!;
  }

  async sign(data: PAYLOAD): Promise<string> {
    return this.jwt.sign(data, {
      expiresIn: this.expiresIn,
      secret: this.secret,
    });
  }

  async verify(data: string): Promise<PAYLOAD> {
    return this.jwt.verify(data, { secret: this.secret });
  }

  async signRefreshToken(data: PAYLOAD): Promise<string> {
    return this.jwt.sign(data, {
      expiresIn: this.expiresIn,
      secret: this.secret,
    });
  }
}
