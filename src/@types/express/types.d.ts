import { PAYLOAD } from 'src/utils/jwt/jwt.service';

declare module 'express' {
  export interface Request {
    user: PAYLOAD;
  }
}
