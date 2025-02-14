import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { NEEDS_AUTH } from 'src/shared/constants';

export const NeedsAuth = (): MethodDecorator & ClassDecorator => {
  return applyDecorators(SetMetadata(NEEDS_AUTH, true), UseGuards(JwtGuard));
};
