import { IsString } from 'class-validator';

export class Keys {
  @IsString() pubKey: string;
  @IsString() privKey: string;
}
