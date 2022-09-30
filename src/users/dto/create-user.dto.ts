import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsAlphanumeric,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  // ValidateIf,
} from 'class-validator';
import { ROLE } from '../../const';

export class CreateUserDto {
  @IsString()
  @Length(6, 30)
  // @IsAlphanumeric()
  readonly fullName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email_address: string;

  // @IsNotEmpty()
  // @IsString()
  // @IsIn(Object.values(GENDERS))
  // readonly gender: GENDERS;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(Object.keys(ROLE).length)
  @ArrayUnique()
  readonly roles: ROLE[];

  // @ValidateIf((o) => o.roles.includes(ROLE.FIELD_OFFICER))
  // @IsString()
  // @MaxLength(30)
  // first_name?: string;
  
  @IsString()
  @Length(6, 30)
  // @IsAlphanumeric()
  readonly companyName: string;

  @IsString()
  @Length(6, 30)
  // @IsAlphanumeric()
  readonly address: string;
}
