import { IsEmail, IsInt, IsString, Length } from 'class-validator';
import { Keys } from './keys.model';

export class User {
  @IsInt() id: number;
  @IsEmail() email: string;
  @IsString()
  @Length(4, 10)
  passwordHash: string;
  keys?: Keys;
}
