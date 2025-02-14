import {
  DynamicModule,
  FactoryProvider,
  Module,
  ModuleMetadata,
} from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

export interface JWTOptions {
  imports?: ModuleMetadata['imports'];
  inject?: FactoryProvider['inject'];
  useFactory(...args: any[]): Promise<JwtModuleOptions> | JwtModuleOptions;
}

@Module({})
export class GlobalJWTModule {
  static initAsync(options: JWTOptions): DynamicModule {
    options.imports ||= [];
    options.inject ||= [];
    return {
      global: true,
      module: GlobalJWTModule,
      imports: [
        ...options.imports,
        JwtModule.registerAsync({
          useFactory: options.useFactory,
          inject: options.inject,
        }),
      ],
    };
  }
}
