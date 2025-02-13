import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';
import { randomBytes } from 'crypto';

export class AuthUtils {
  async generateHash(password: string): Promise<string> {
    return hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  generateJwtToken(payload: any, jwtService: JwtService): string {
    return jwtService.sign(payload);
  }

  generateResetToken(): string {
    return randomBytes(20).toString('hex');
  }

  validateEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
