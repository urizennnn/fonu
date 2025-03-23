import { Request } from 'express';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseFormat<T> {
  statusCode: number | undefined;
  data: T;
  message: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    const response = context.switchToHttp().getResponse<Request>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: T): ResponseFormat<T> => {
        let message = 'Request successful';
        let payload = data;
        if (data && typeof data === 'object') {
          if ('message' in data && typeof data.message === 'string') {
            message = data.message;
          }
          if ('data' in data) {
            payload = data.data as T;
          }
        }
        return {
          statusCode,
          data: payload,
          message,
        };
      }),
    );
  }
}
