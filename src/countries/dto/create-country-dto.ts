import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCountryDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  readonly countryName: string;

  @IsNotEmpty()
  @IsString()
  readonly countryCode: string;

  @IsNotEmpty()
  @IsString()
  readonly countryFlag: string;
}
