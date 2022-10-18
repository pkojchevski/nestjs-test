import { Injectable, NestMiddleware } from '@nestjs/common';
import { JWT_SECRET } from '../constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const authJwtToken = req.headers.authorization;

    console.log({ authJwtToken });

    if (!authJwtToken) {
      next();
      return;
    }

    try {
      const user = jwt.verify(authJwtToken, JWT_SECRET);

      if (user) {
        console.log('Found user details');
        req['user'] = user;
      }
    } catch (err) {
      console.log('Error handling auth JWT');
    }

    next();
  }
}
