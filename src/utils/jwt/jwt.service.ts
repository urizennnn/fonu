import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user/user.entity';

export type PAYLOAD = Pick<User, 'email' | 'id'>;

@Injectable()
export class JWTService {
  private readonly secret: string;
  private readonly expiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secret = this.configService.get<string>('JWT_SECRET')!;
    this.expiresIn = this.configService.get<string>('JWT_EXPIRES_IN')!;
    this.refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    )!;
  }

  returnTokens(payload: PAYLOAD) {
    const accessToken = this.sign(payload);
    const refreshToken = this.signRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  sign(data: PAYLOAD): string {
    return this.jwt.sign(data, {
      expiresIn: this.expiresIn,
      secret: this.secret,
    });
  }

  verify(data: string): PAYLOAD {
    try {
      return this.jwt.verify<PAYLOAD>(data, { secret: this.secret });
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new Error('Invalid token');
    }
  }

  signRefreshToken(data: PAYLOAD): string {
    return this.jwt.sign(data, {
      expiresIn: this.refreshExpiresIn,
      secret: this.secret,
    });
  }
}
