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
  IsOptional,
  // ValidateIf,
} from "class-validator";
import { ROLE } from "../../const";

export class CreateUserDto {
  @IsString()
  @Length(6, 30)
  @IsOptional()
  readonly fullName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email_address: string;

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
  // @IsAlphanumeric()
  readonly address: string;

  @IsString()
  @Length(3, 30)
  @IsOptional()      
  readonly contact_id: string;
}
