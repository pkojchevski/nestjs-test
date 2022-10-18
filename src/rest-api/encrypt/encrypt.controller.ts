import {
  Controller,
  Post,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

import { AuthenticationGuard } from '../guards/authentication.guard';
import { EncryptService } from './encrypt.service';

@Controller('api')
export class EncryptController {
  constructor(
    private encryptService: EncryptService,
    private authService: AuthService,
  ) {}

  @Post('/encrypt')
  @UseGuards(AuthenticationGuard)
  async encrypt(@Req() request: Request) {
    return new Promise(async (resolve, reject) => {
      const { email } = request['user'];

      if (!email) reject(new UnauthorizedException());

      const { keys } = await this.authService.findUser(email);

      if (!keys) resolve(new Error('Key pair does not exists'));

      const pdfFile = await this.encryptService.getPdfFile();
      const encrFile = await this.encryptService.encryptPdfFile(
        pdfFile,
        keys.pubKey,
      );
      return resolve(encrFile);
    });
  }
}
