import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class UpdateProviderDto {
  @IsOptional()
  @IsString()
  @Length(2, 30)
  readonly name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly logo: string;

  @IsOptional()
  @IsBoolean()
  readonly is_active: boolean;
}
