import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { User } from './users.model';

import * as passwordHashAndSalt from 'password-hash-and-salt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET, PWD } from '../constants';
import { AuthService } from './auth.service';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { Credentials } from './credentials.model';
import { Keys } from './keys.model';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-in')
  async signIn(@Body() credentials: Credentials): Promise<object> {
    const { email, password } = credentials;
    const user: User = await this.authService.findUser(email);

    if (!user) {
      console.log('User does not exists');
      throw new UnauthorizedException();
    }

    return new Promise((resolve, reject) => {
      passwordHashAndSalt(password).verifyAgainst(
        user.passwordHash,
        (err, verified) => {
          if (!verified) {
            reject(new UnauthorizedException());
          }
          const authJwtToken = jwt.sign({ email }, JWT_SECRET, {
            expiresIn: 60 * 60,
          });
          resolve({ authJwtToken: `Bearer ${authJwtToken}` });
        },
      );
    });
  }

  @Post('/generate-key-pair')
  @UseGuards(AuthenticationGuard)
  async generateKeyPair(@Req() request: Request) {
    return new Promise(async (resolve, reject) => {
      const keys: Keys = await this.authService.getKeyPair();
      if (!keys) {
        reject(new UnauthorizedException());
      }
      const { email } = request['user'];

      await this.authService.saveKeyPairToUser(keys, email);

      return resolve(keys);
    });
  }
}
