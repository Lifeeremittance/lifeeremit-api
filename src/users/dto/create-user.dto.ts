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
} from "class-validator";
import { ROLE } from "../../const";

export class CreateUserDto {
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

  @IsString()
  @Length(3, 30)
  // @IsAlphanumeric()
  readonly companyName: string;

  @IsString()
  @Length(6, 30)
  // @IsAlphanumeric()
  readonly phone_number: string;

  @IsString()
  @Length(3, 30)
  // @IsAlphanumeric()
  readonly address: string;
}
