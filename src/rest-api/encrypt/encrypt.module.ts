import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { EncryptController } from './encrypt.controller';
import { EncryptService } from './encrypt.service';

@Module({
  imports: [],
  controllers: [EncryptController],
  providers: [EncryptService, AuthService],
})
export class EncryptModule {}
