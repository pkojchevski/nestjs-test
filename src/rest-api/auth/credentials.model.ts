import { IsEmail, IsString, Length } from 'class-validator';

export class Credentials {
  @IsEmail() email: string;
  @IsString()
  @Length(4, 10)
  password: string;
}
