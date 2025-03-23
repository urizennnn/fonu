import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guard/auth.guard';

export const NEEDS_AUTH = Symbol('NEEDS_AUTH');
export const NeedsAuth = (): MethodDecorator & ClassDecorator => {
  return applyDecorators(SetMetadata(NEEDS_AUTH, true), UseGuards(JwtGuard));
};
