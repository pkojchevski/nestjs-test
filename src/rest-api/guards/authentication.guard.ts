import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Credentials } from '../auth/credentials.model';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const host = context.switchToHttp();
    const request = host.getRequest();

    // console.log({ request });

    const user = request['user'];

    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
