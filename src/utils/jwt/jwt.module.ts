import {
  DynamicModule,
  FactoryProvider,
  Module,
  ModuleMetadata,
} from '@nestjs/common';
import {
  JwtModule,
  JwtModuleAsyncOptions,
  JwtModuleOptions,
} from '@nestjs/jwt';

export interface JWTOptions {
  imports?: ModuleMetadata['imports'];
  inject?: FactoryProvider['inject'];
  useFactory: (...args: any[]) => JwtModuleOptions;
}

@Module({})
export class GlobalJWTModule {
  static initAsync(options: JWTOptions): DynamicModule {
    return {
      global: true,
      module: GlobalJWTModule,
      imports: [
        ...(options.imports || []),
        JwtModule.registerAsync({
          useFactory: (...args) => options.useFactory(...args),
          inject: options.inject || [],
        } as JwtModuleAsyncOptions),
      ],
    };
  }
}
