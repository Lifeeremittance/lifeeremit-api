import {
  IsString,
  Length,
  IsOptional,
  IsBoolean,
} from "class-validator";

export class UpdateCountryDto {
  @IsOptional()
  @IsString()
  @Length(2, 30)
  readonly countryName: string;

  @IsOptional()
  @IsString()
  @Length(2, 30)
  readonly countryCode: string;

  @IsOptional()
  @IsString()
  readonly countryFlag: string;

  @IsOptional()
  @IsBoolean()
  readonly is_active: boolean;
}
