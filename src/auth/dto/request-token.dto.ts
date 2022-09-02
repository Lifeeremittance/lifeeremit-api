import { LOGIN_ENTITIES } from '../../const';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class RequestTokenDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email_address: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(LOGIN_ENTITIES))
  readonly entity: LOGIN_ENTITIES;
}
