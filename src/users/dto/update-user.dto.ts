import { PartialType } from "@nestjs/mapped-types";
import { IsString, Length, validate, IsOptional } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @Length(6, 30)
  @IsOptional()
  readonly fullName: string;

  @IsString()
  @Length(6, 6)
  @IsOptional()
  readonly token: string;
}

validate(UpdateUserDto, { skipMissingProperties: true });
