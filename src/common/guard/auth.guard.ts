import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { JWTService, PAYLOAD } from 'src/utils/jwt/jwt.service';
import { NEEDS_AUTH } from '../decorators';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: PAYLOAD;
}

@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JWTService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const needsAuth = this.reflector.getAllAndOverride<boolean>(NEEDS_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!needsAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request || !request.headers) {
      throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new HttpException(
        'Authentication token is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const payload = await this.jwtService.verify(token);

      if (!payload || typeof payload !== 'object' || !payload.id) {
        throw new HttpException(
          'Invalid token payload',
          HttpStatus.UNAUTHORIZED,
        );
      }

      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
      }

      if (
        error instanceof Error &&
        (error.message === 'jwt malformed' ||
          error.message === 'invalid signature')
      ) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      throw new HttpException('Authorization failed', HttpStatus.UNAUTHORIZED);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (!request.headers.authorization) return undefined;

    const [type, token] = request.headers.authorization.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
